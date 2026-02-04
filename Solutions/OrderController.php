<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // i removed the customer , items and latestCartItem loading because we were querying the db inside the loop.
        // PS: i loaded latestCartItem be i'm assuming we added a latestCartItem hasOne relationship in the Order model.
        $orders = Order::with(['customer', 'items', 'latestCartItem'])
            ->orderBy('completed_at', 'desc') //I moved sorting to DB level for better performance , imaging having thousands of orders
            ->get();

        $data = $orders->map(function ($o) {
            
            // calculate total in memory since items are loaded
            $total = $o->items->sum(fn($i) => $i->price * $i->quantity);

            return [
                'order_id'       => $o->id,
                'customer_name'  => $o->customer->name ?? 'customer deleted ? or didn\'t input his name maybe',
                'total_amount'   => $total,
                'items_count'    => $o->items->count(),
                
                // since we loaded latestCartItem relationship we can use it directly without querying again
                'last_added_to_cart' => $o->latestCartItem?->created_at,
                
                // we don't need to fetch the object again since we have it from the first query, we just check the status
                'completed_order_exists' => $o->status === 'completed',
                'created_at'     => $o->created_at,
            ];
        });

        return view('orders.index', ['orders' => $data]);
    }
}