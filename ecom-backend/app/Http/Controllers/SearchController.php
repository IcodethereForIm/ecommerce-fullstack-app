<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class SearchController extends Controller
{
    //
    public function index(Request $request)
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json([]);
        }

        $products = Product::with('images')
    ->where('name', 'LIKE', "%$query%")
    ->orWhere('description', 'LIKE', "%$query%")
    ->limit(10)
    ->get()
    ->map(function ($product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            "thumbnail"=> $product->thumbnail,
            'price' => $product->price,
            'image' => $product->images->first()->url ?? null,
            'description' => $product->description,
        ];
    });

        return response()->json($products);
    }
}
