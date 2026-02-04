<?php

use App\Services\SpreadsheetService;
use App\Models\Product;
use App\Jobs\ProcessProductImage;
use Illuminate\Support\Facades\Queue;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Queue::fake();
    
    $this->importer = Mockery::mock();
    app()->instance('importer', $this->importer);
});

it('saves products from a valid spreadsheet', function () {
    $rows = [
        ['product_code' => 'SKU-1', 'quantity' => 50],
        ['product_code' => 'SKU-2', 'quantity' => 25],
    ];

    $this->importer->shouldReceive('import')->once()->andReturn($rows);

    (new SpreadsheetService())->processSpreadsheet('path_to/file.xlsx');

    expect(Product::count())->toBe(2);
    $this->assertDatabaseHas('products', ['code' => 'SKU-1']); 
});

it('skips rows with missing or bad data', function () {
    $rows = [
        ['product_code' => 'MISSING-QTY'],
        ['quantity' => 10],
        ['product_code' => 'BAD-QTY', 'quantity' => 0],
        ['product_code' => 'NEGATIVE', 'quantity' => -5],
    ];

    $this->importer->shouldReceive('import')->andReturn($rows);

    (new SpreadsheetService())->processSpreadsheet('bad_data.xlsx');

    expect(Product::count())->toBe(0);
    Queue::assertNothingPushed();
});

it('processes valid rows even if some are junk', function () {
    $rows = [
        ['product_code' => 'VALID-1', 'quantity' => 1],
        ['product_code' => '', 'quantity' => 5],
        ['product_code' => 'VALID-2', 'quantity' => 10],
    ];

    $this->importer->shouldReceive('import')->andReturn($rows);

    (new SpreadsheetService())->processSpreadsheet('mixed.xlsx');

    expect(Product::count())->toBe(2);
    Queue::assertPushed(ProcessProductImage::class, 2);
});

it('stops duplicate product codes from being imported', function () {
    Product::create(['code' => 'EXISTING', 'quantity' => 1]);

    $rows = [
        ['product_code' => 'EXISTING', 'quantity' => 99],
        ['product_code' => 'NEW-ONE', 'quantity' => 5],
    ];

    $this->importer->shouldReceive('import')->andReturn($rows);

    (new SpreadsheetService())->processSpreadsheet('dupes.xlsx');

    expect(Product::count())->toBe(2);
    expect(Product::where('code', 'EXISTING')->first()->quantity)->toBe(1);
});

it('dispatches job with the right product instance', function () {
    $rows = [
        ['product_code' => 'JOB-CHECK', 'quantity' => 10]
    ];

    $this->importer->shouldReceive('import')->andReturn($rows);

    (new SpreadsheetService())->processSpreadsheet('job_test.xlsx');

    Queue::assertPushed(ProcessProductImage::class, function ($job) {
        return $job->product->code === 'JOB-CHECK';
    });
});

it('handles empty spreadsheets gracefully', function () {
    $this->importer->shouldReceive('import')->andReturn([]);

    (new SpreadsheetService())->processSpreadsheet('empty.xlsx');

    expect(Product::count())->toBe(0);
    Queue::assertNothingPushed();
});
