<?php
// data
$employees  = collect([
    ['name' => 'John', 'city' => 'Dallas'],
    ['name' => 'Jane', 'city' => 'Austin'],
    ['name' => 'Jake', 'city' => 'Dallas'],
    ['name' => 'Jill', 'city' => 'Dallas'],
]);

$offices  = collect([
    ['office' => 'Dallas HQ', 'city' => 'Dallas'],
    ['office' => 'Dallas South', 'city' => 'Dallas'],
    ['office' => 'Austin Branch', 'city' => 'Austin'],
]);

$result = $offices 
    ->groupBy('city') //first i grouped offices by city 
    ->map(function ($group, $city) use ($employees) {
        
        // get all employee names in this city
        $names = $employees->where('city', $city)
            ->pluck('name') // i want only the names of employees without the city key
            ->values()
            ->all();

        // i use mapWithKeys to change the keys of the array to the offices name and assign the names of employees to them
        return $group->mapWithKeys(fn($o) => [
            $o['office'] => $names
        ]);
    })
    ->all();

dd($result);