<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductImage;
use Cloudinary\Api\Upload\UploadApi;
class MigrateImagesToCloudinary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = "ProductImages:migrate-cloudinary";

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
        $this->info("Starting migration...");

    ProductImage::whereNotNull('image_path')
        ->chunk(50, function ($images) {

            foreach ($images as $image) {

                // Skip already migrated (URLs)
                if (filter_var($image->image_path, FILTER_VALIDATE_URL)) {
                    $this->line("Skipped ID {$image->id} (already migrated)");
                    continue;
                }

                $localPath = storage_path('app/public/' . $image->image_path);

                // Check if file exists
                if (!file_exists($localPath)) {
                    $this->warn("Missing file: {$image->image_path}");
                    continue;
                }

                try {
                    $this->line("Uploading: {$localPath}");

                    $uploaded = (new UploadApi())->upload($localPath, [
                        'folder' => 'migrated-products'
                    ]);

                    // Update DB
                    $image->update([
                        'image_path' => $uploaded['secure_url'],
                        'public_id'  => $uploaded['public_id'],
                    ]);

                    $this->info("Migrated ID: {$image->id}");

                } catch (\Exception $e) {
                    $this->error("Failed ID {$image->id}: " . $e->getMessage());
                }
            }

        });

    $this->info("✅ Migration completed!");

    }
}
