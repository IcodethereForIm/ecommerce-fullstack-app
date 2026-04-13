<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // men, men-upper, featured
            $table->string('title')->nullable();
            $table->string('layout')->default('default'); // default, two-column, promo
            $table->boolean('show_banner')->default(true);
            $table->boolean('show_products')->default(true);
            $table->json('sections')->nullable(); // dynamic sections
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
