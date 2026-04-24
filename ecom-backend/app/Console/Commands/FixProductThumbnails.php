<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;

class FixProductThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:fix-thumbnails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $this->info("Fixing thumbnails...");

        Product::with('images')->chunk(50, function ($products) {

            foreach ($products as $product) {

                // Skip if already Cloudinary
                if ($product->thumbnail && str_starts_with($product->thumbnail, 'http')) {
                    continue;
                }

                // Get primary image
                $primary = $product->images->where('is_primary', true)->first();

                // fallback: first image
                if (!$primary) {
                    $primary = $product->images->first();
                }

                if ($primary) {
                    $product->update([
                        'thumbnail' => $primary->image_path
                    ]);

                    $this->info("Updated product ID: {$product->id}");
                } else {
                    $this->warn("No image found for product ID: {$product->id}");
                }
            }

        });

        $this->info("✅ Thumbnails fixed!");
    }
    
}
