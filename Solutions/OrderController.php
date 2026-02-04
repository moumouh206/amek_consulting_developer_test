<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        // i loaded everything to stop the N+1 issues
        // loading items.product just in case we neeed product details later
        $orders = Order::with(['customer', 'items.product', 'cartItems' => function ($q) {
                $q->orderByDesc('created_at');
            }])
            // pushing the math to the DB for better perforance
            ->withSum('items as total_amount_raw', DB::raw('price * quantity'))
            ->withCount('items as items_count')
            ->orderByDesc('completed_at') // sorting here is better becasue of indexs
            ->get();

        $data = $orders->map(function ($o) {
            return [
                'order_id'      => $o->id,
                'customer_name' => $o->customer->name ?? 'N/A',
                'total_amount'  => $o->total_amount_raw ?? 0,
                'items_count'   => $o->items_count,
                
                // since we are looking for the last one  we get the first one from the sorted relaionship
                'last_added_to_cart' => $o->cartItems->first()?->created_at,
                
                // imagien querying the DB again here... glad we just check status
                'completed_order_exists' => $o->status === 'completed',
                'created_at'    => $o->created_at,
            ];
        });

        // passing it to the view
        return view('orders.index', ['orders' => $data]);
    }
}