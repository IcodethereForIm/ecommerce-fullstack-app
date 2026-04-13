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
        Schema::table('products', function (Blueprint $table) {
            //
        $table->string('slug')->nullable()->after("name");
        $table->string('sku')->nullable()->after('slug');
        $table->decimal('sale_price', 10, 2)->nullable()->after('price');
        $table->unsignedInteger('stock')->default(0)->after('sale_price');
        $table->string('thumbnail')->nullable()->after('description');
        $table->boolean('is_active')->default(1);
        $table->boolean('is_featured')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
            $table->dropColumn([
            'slug',
            'sku',
            'sale_price',
            'stock',
            'thumbnail',
            'is_active',
            'is_featured'
        ]);
        });
    }
};
