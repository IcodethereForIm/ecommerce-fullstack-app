<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Image;
//use Illuminate\Support\Facades\Storage;
use Cloudinary\Api\Upload\UploadApi;
class ImageController extends Controller
{
    //
     // Upload Image
    public function store(Request $request)
    {   
        
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        try {
            $uploaded = (new UploadApi())->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'site-images'
                ]
            );

            $image = Image::create([
                'file_path' => $uploaded['secure_url'], // store Cloudinary URL
                'public_id' => $uploaded['public_id'],  // store public_id
                'alt_text'  => $request->alt_text ?? null,
            ]);

            return response()->json([
                'message' => 'Image uploaded successfully',
                'data' => $image
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Upload failed',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    // Get All Images
    public function index()
    {
        return Image::latest()->get();
    }

    // Delete Image
    public function destroy($id)
{
    $image = Image::findOrFail($id);

    try {
        (new UploadApi())->destroy($image->public_id);

        $image->delete();

        return response()->json([
            'message' => 'Image deleted successfully'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Delete failed',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
