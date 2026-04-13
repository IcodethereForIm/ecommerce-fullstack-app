<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductImage;

class MigrateOldImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $products= Product::all();

        foreach($products as $product){
            if($product->image){
            ProductImage::create([
               'product_id' => $product->id,
                    'image_path' => $product->image,
                    'is_primary' => true
            ]);
        }
        
        }
    }
}
