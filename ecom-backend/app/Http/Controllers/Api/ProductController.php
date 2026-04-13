<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
 use Illuminate\Support\Facades\Storage;
 use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    //genreating slug 

    private function generateUniqueSlug($name)
{
    $slug = Str::slug($name);
    $originalSlug = $slug;
    $count = 1;

    while (Product::where('slug', $slug)->exists()) {
        $slug = $originalSlug . '-' . $count;
        $count++;
    }

    return $slug;
}
    //creating products
    public function store(Request $request){


    $request->validate([
        'name' => 'required|string',
    
        'categoryId' => 'required|exists:categories,id',
        'price' => 'required|numeric',
        'sale_price' => 'nullable|numeric',
        'sku' => 'nullable|string',
        'product_type' => 'nullable|string',
        'is_active' => 'nullable|boolean',
        'is_featured' => 'nullable|boolean',
        'images.*' => 'image|mimes:jpg,png,jpeg|max:2048',
        'sizes' => 'nullable|array',
        'sizes.*.size' => 'required|string',
        'sizes.*.stock' => 'required|integer',
    ]);

    $product= Product::create([
        "name"=>$request->name,
        "slug" => $this->generateUniqueSlug($request->name),
        
        'category_id' => $request->categoryId,
        "price"=>$request->price,
        "sale_price"=>$request->sale_price,
        "sku"=>$request->sku,
        "product_type"=>$request->product_type,
        "description"=>$request->description,
        "is_active"=>$request->is_active ?? 1,
        "is_featured"=>$request->is_featured ?? 0,
    ]);


    $imagePath = null;
    if ($request->hasFile("images")) {
        $isFirst = true;

        foreach ($request->file("images") as $img) {
            $path = $img->store("products", "public");

            $product->images()->create([
                'image_path' => $path,
                'is_primary' => $isFirst, // first image primary
            ]);

            // thumbnail > first image
            if ($isFirst) {
                $product->thumbnail = $path;
                $isFirst = false;
            }
        }

        $product->save(); // save thumbnail
    }


    if($request->has('sizes')){
        foreach($request->sizes as $sizeData){
            $product->sizes()->create([
                'size' => $sizeData['size'],
                'stock' => $sizeData['stock']
            ]);
        }
    }
    
    return response()->json($product->load(["images","sizes"]), 201);

    }

    //filtering products
    public function index(Request $request){
        $query = Product::with('images', 'sizes');

    //  Gender filter
    if ($request->filled('gender')) {
        $category = Category::where('slug', $request->gender)->first();

        if ($category) {
            $childIds = $category->children->pluck('id')->toArray();
            $allCategoryIds = array_merge([$category->id], $childIds);

            //  Subcategory filter
            if ($request->filled('subcategory')) {
                $subCategory = Category::where('slug', $request->subcategory)
                    ->whereIn('id', $allCategoryIds)
                    ->first();

                if ($subCategory) {
                    $allCategoryIds = [$subCategory->id];
                }
            }

            $query->whereIn('category_id', $allCategoryIds);
        }
    }

    //  Product type filter (works with or without gender)
    if ($request->filled('type')) {
        $query->where('product_type', $request->type);
    }

    if ($request->filled('limit')) {
    $query->limit($request->limit);
}

    return response()->json($query->get());
    }
    //specific product show
    public function show($id){
        $product = Product::with("images","sizes")->findOrFail($id);
        return response()->json($product);
    }
    //latest products show
    public function latest(){
    $products = Product::with("images","sizes")
        ->latest()        // order by created_at DESC
        ->take(5)         // limit for homepage
        ->get();
        return response()->json($products);
    }

    //addsize
public function addSizes(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'sizes' => 'required|array',
        'sizes.*.size' => 'required|string',
        'sizes.*.stock' => 'required|integer',
    ]);

    $product = Product::findOrFail($request->product_id);

    foreach ($request->sizes as $sizeData) {

        // Prevent duplicate sizes
        $exists = $product->sizes()
            ->where('size', $sizeData['size'])
            ->exists();

        if (!$exists) {
            $product->sizes()->create([
                'size' => $sizeData['size'],
                'stock' => $sizeData['stock']
            ]);
        }
    }

    return response()->json([
        'message' => 'Sizes added successfully'
    ]);
}

    //Update
public function updatePartial(Request $request, $id)
{
    $product = Product::with('images')->findOrFail($id);

    $data = [];

    if ($request->has('name')) {
        $data['name'] = $request->name;

        if ($product->name !== $request->name) {
            $data['slug'] = $this->generateUniqueSlug($request->name);
        }
    }

    if ($request->has('sku')) {
        $data['sku'] = $request->sku;
    }

    if ($request->has('categoryId')) {
        $data['category_id'] = $request->categoryId;
    }

    if ($request->has('product_type')) {
        $data['product_type'] = $request->product_type;
    }

    if ($request->has('price')) {
        $data['price'] = $request->price;
    }

    if ($request->has('sale_price')) {
        $data['sale_price'] = $request->sale_price;
    }

    if ($request->has('description')) {
        $data['description'] = $request->description;
    }

    if ($request->has('is_active')) {
        $data['is_active'] = $request->is_active;
    }

    if ($request->has('is_featured')) {
        $data['is_featured'] = $request->is_featured;
    }

    DB::transaction(function () use ($request, $product, $data) {

        
        if (!empty($data)) {
            $product->update($data);
        }

        
        if ($request->hasFile("images")) {

            
            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img->image_path);
                $img->delete();
            }

            
            $isFirst = true;

            foreach ($request->file("images") as $img) {
                $path = $img->store("products", "public");

                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $isFirst,
                ]);

                if ($isFirst) {
                    $product->thumbnail = $path;
                    $isFirst = false;
                }
            }

            $product->save(); 
        }
    });
   
    return response()->json(
        $product->load(['images', 'sizes'])
    );
}
//delete
public function destroy($id)
{
    $product = Product::with('images', 'sizes')->findOrFail($id);

    DB::transaction(function () use ($product) {

        
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
            $img->delete();
        }

        
        $product->sizes()->delete();

        
        $product->delete();
    });

    return response()->json([
        'message' => 'Product deleted successfully'
    ]);
}
    
}
