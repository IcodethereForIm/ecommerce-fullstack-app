<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Image;
use Cloudinary\Api\Upload\UploadApi;

class MigrateImagesTableToCloudinary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:migrate-table-cloudinary';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate images table files to Cloudinary';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $this->info("Starting Image table migration...");

        Image::whereNotNull('file_path')
            ->chunk(50, function ($images) {

                foreach ($images as $image) {

                    // Skip already migrated
                    if (filter_var($image->file_path, FILTER_VALIDATE_URL)) {
                        $this->line("Skipped ID {$image->id} (already migrated)");
                        continue;
                    }

                    $localPath = storage_path('app/public/' . $image->file_path);

                    // Check file exists
                    if (!file_exists($localPath)) {
                        $this->warn("Missing file: {$image->file_path}");
                        continue;
                    }

                    try {
                        $this->line("Uploading: {$localPath}");

                        $uploaded = (new UploadApi())->upload($localPath, [
                            'folder' => 'site-images'
                        ]);

                        // Update DB
                        $image->update([
                            'file_path' => $uploaded['secure_url'],
                            'public_id' => $uploaded['public_id'],
                        ]);

                        $this->info("Migrated ID: {$image->id}");

                    } catch (\Exception $e) {
                        $this->error("Failed ID {$image->id}: " . $e->getMessage());
                    }
                }

            });

        $this->info("✅ Image table migration completed!");
    }

}
