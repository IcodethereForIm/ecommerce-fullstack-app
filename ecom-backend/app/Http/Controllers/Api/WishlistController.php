<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class WishlistController extends Controller
{
    //
    public function toggle(Request $request,$productId)
    {
        $user = $request->user();

        if ($user->wishlist()->where('product_id', $productId)->exists()) {
            $user->wishlist()->detach($productId);

            return response()->json([
                'status' => 'removed',
                'message' => 'Removed from wishlist'
            ]);
        } else {
            $user->wishlist()->attach($productId);

            return response()->json([
                'status' => 'added',
                'message' => 'Added to wishlist'
            ]);
        }
    }

    // Get all wishlist items
    public function index(Request $request)
    {
        $wishlist = $request->user()
            ->wishlist()
            ->with('images') // optional if you have images relation
            ->get();

        return response()->json($wishlist);
    }

    // Optional: remove specific item
    public function remove(Request $request,$productId)
    {
        $user = $request->user();
        $user->wishlist()->detach($productId);

        return response()->json([
            'message' => 'Removed from wishlist'
        ]);
    }
}
