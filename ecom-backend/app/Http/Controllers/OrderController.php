<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Razorpay\Api\Api;
use App\Models\ShippingAddress;

class OrderController extends Controller
{
    //
    public function createOrder(){
        try{
        $user = Auth::user();

        $cartItems = CartItem::with('product')
        ->where('user_id', $user->id)
        ->get();

    if ($cartItems->isEmpty()) {
        return response()->json(['message' => 'Cart is empty'], 400);
    }

    $total = 0;

    foreach ($cartItems as $item) {
        $total += $item->product->price * $item->quantity;
    }

    //getting adress default
    $address = ShippingAddress::where('user_id', $user->id)
            ->where('is_default', 1)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'No default shipping address found'], 400);
        }

    // Create Razorpay Order
    $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

    $razorpayOrder = $api->order->create([
        'receipt' => 'order_' . uniqid(),
        'amount' => $total * 100, // paise
        'currency' => 'INR'
    ]);

    $order = Order::create([
        'user_id' => $user->id,
        'total_amount' => $total,
        'status' => 'pending',
        'order_id_gateway' => $razorpayOrder['id'],

        'shipping_name' => $address->full_name,
        'shipping_phone' => $address->phone,
        'shipping_address_line_1' => $address->address_line_1,
        'shipping_city' => $address->city,
        'shipping_state' => $address->state,
        'shipping_pincode' => $address->pincode,
    ]);

    foreach ($cartItems as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'price' => $item->product->price
        ]);
    }
    return response()->json([
        'order_id' => $order->id,
        'razorpay_order_id' => $razorpayOrder['id'],
        'amount' => $razorpayOrder['amount'],
        'key' => env('RAZORPAY_KEY')
    ]);
        }catch(\Exception $e) {

        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
    }

    public function verifyPayment(Request $request)
{
    $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

    $attributes = [
        'razorpay_order_id' => $request->razorpay_order_id,
        'razorpay_payment_id' => $request->razorpay_payment_id,
        'razorpay_signature' => $request->razorpay_signature,
    ];

    try {
        $api->utility->verifyPaymentSignature($attributes);

        // Update order status
        $order = Order::where('order_id_gateway', $request->razorpay_order_id)->first();

        $order->status = 'paid';
        $order->save();

        //CLEAR CART AFTER SUCCESS PAYMENT this bug made me cry 
        CartItem::where('user_id', $order->user_id)->delete();

        return response()->json(['message' => 'Payment verified','order' => $order]);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Payment failed'], 400);
    }
}


public function getOrder($id)
{
    $user = Auth::user();

    // Fetch order with items and products for this user
    $order = Order::with('items.product')
        ->where('id', $id)
        ->where('user_id', $user->id) 
        ->first();

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    return response()->json($order);
}

public function getUserOrders()
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Fetch all orders for this user with items and products
    $orders = Order::with(['items.product.images'])
        
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($orders);
}
}
