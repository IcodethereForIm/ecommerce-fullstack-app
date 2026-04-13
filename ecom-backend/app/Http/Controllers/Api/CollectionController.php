<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Collection;

class CollectionController extends Controller
{
    //
    public function show($slug)
{
    $collection = Collection::where('slug', $slug)
        ->where('is_active', true)
        ->first();

    if (!$collection) {
        return response()->json(['message' => 'Not found'], 404);
    }

    return response()->json($collection);
}

    public function createOrUpdateCollection(Request $request)
    {
        // Validate 
        $data = $request->validate([
            'slug' => 'required|string',
            'title' => 'nullable|string',
            'layout' => 'nullable|string',
            'show_banner' => 'boolean',
            'show_products' => 'boolean',
            'components' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        // Try to find existing collection by slug
        $collection = Collection::firstOrNew(['slug' => $data['slug']]);

        // Update all fields
        $collection->fill($data);
        $collection->save();

        return response()->json([
            'success' => true,
            'collection' => $collection
        ]);
    }
}
