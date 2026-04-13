<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;


class CartController extends Controller
{
    //

    public function index(Request $request){
       $userId = $request->user()->id;

    return response()->json(
        CartItem::with("product.images")
            ->where("user_id",$userId)
            ->get()
    );
    }

    public function add(Request $request){
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'size' => 'required|string'
    ]);
    

    $userId = $request->user()->id;

    $cartItem = CartItem::where('product_id', $request->product_id)
        ->where('user_id', $userId)
        ->where('size', $request->size)
        ->first();

    if ($cartItem) {
        $cartItem->quantity += $request->quantity;
        $cartItem->save();
    } else {
        CartItem::create([
            'user_id' => $userId,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'size' => $request->size 
        ]);
    }

    return response()->json(
        CartItem::with('product.images')
            ->where('user_id', $userId)
            ->get()
    );
}

    public function update(Request $request, $product_id, $size)
{
    $request->validate(['quantity' => 'required|integer|min:1','size' => 'required|string']);

    $cartItem = CartItem::where('product_id', $product_id)
        ->where('user_id', $request->user()->id)
        ->where('size', $size) 
        ->firstOrFail();

    $cartItem->quantity = $request->quantity;
    $cartItem->save();

    return response()->json(
        CartItem::with('product.images')
            ->where('user_id', $request->user()->id)
            ->get()
    );
}
    public function remove(Request $request, $product_id, $size){
    $cartItem = CartItem::where('product_id', $product_id)
        ->where('user_id', $request->user()->id)
        ->where('size', $size) 
        ->firstOrFail();

    $cartItem->delete();

    return response()->json(
        CartItem::with('product.images')
            ->where('user_id', $request->user()->id)
            ->get()
    );
}

    public function merge(Request $request){
        $userId = $request->user()->id;
        $items=$request->items;
        foreach($items as $item){
            $existing = CartItem::where("user_id",$userId)->where("product_id",$item["id"])->where("size",$item["selectedSize"])->first();
            if($existing){
                $existing->quantity+=$item["quantity"];
                $existing->save();
            }else{
                CartItem::create([
                'user_id' => $userId,
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'size' => $item['selectedSize']
                ]);
            }
        }
        return response()->json(
        CartItem::with('product.images')
            ->where('user_id', $userId)
            ->get()
        );
    }
}
