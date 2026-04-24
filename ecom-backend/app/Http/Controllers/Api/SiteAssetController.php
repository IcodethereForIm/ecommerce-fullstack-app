<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiteAsset;
use Illuminate\Support\Facades\Storage;
class SiteAssetController extends Controller
{
    // Upload image
    public function store(Request $request)
{
    $request->validate([
        'section' => 'required|string',
        'key' => 'required|string',//type
        'asset_key' => 'required|string',//key
        'image_ids' => 'required|array',
        'image_ids.*' => 'exists:images,id',
    ]);

    //clearing old assets
    
    SiteAsset::where('section', $request->section)
        ->where('key', $request->key)
        ->where('asset_key', $request->asset_key)
        ->delete();

    $data = [];

    foreach ($request->image_ids as $index => $imageId) {
        $asset = SiteAsset::create([
            'section' => $request->section,
            'key' => $request->key,
            'asset_key' => $request->asset_key,
            'image_id' => $imageId,
            'position' => $index
        ]);

        $data[] = $asset;
    }

    return response()->json([
        'message' => 'Assets saved successfully ✅',
        'data' => $data
    ]);
}

    // Get images by asset name
    public function show($section, $key, $asset_key)
{
    $assets = SiteAsset::with('image')
        ->where('section', $section)
        ->where('key', $key)
        ->where('asset_key', $asset_key)
        ->orderBy('position')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'image_url' => $item->image->file_path,
                'position' => $item->position
            ];
        });

    return response()->json([
        'data' => $assets
    ]);
}

public function getSectionsBySlug($key)
{
     $sections = SiteAsset::where('key', $key)
        ->distinct()
        ->pluck('section');

    return response()->json([
        'section' => $sections
    ]);
}

    public function index($section, $key)
{
    $assets = SiteAsset::with('image')
        ->where('section', $section)
        ->where('key', $key)
        ->orderBy('position')
        ->get()
        ->groupBy('asset_key');

    return response()->json($assets);
}

    //  Delete image
    public function destroy($id)
    {
        $asset = SiteAsset::findOrFail($id);
        $asset->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
