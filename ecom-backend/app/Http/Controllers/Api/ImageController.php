<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
class ImageController extends Controller
{
    //
     public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('images', 'public');

        $image = Image::create([
            'file_path' => $path,
            'alt_text' => $request->alt_text ?? null,
        ]);

        return response()->json([
            'message' => 'Image uploaded successfully',
            'data' => $image
        ]);
    }

    //  Get All Images
    public function index()
    {
        return Image::latest()->get();
    }

    //  Delete Image 
    public function destroy($id)
    {
        $image = Image::findOrFail($id);

        Storage::disk('public')->delete($image->file_path);
        $image->delete();

        return response()->json([
            'message' => 'Image deleted successfully'
        ]);
    }
}
