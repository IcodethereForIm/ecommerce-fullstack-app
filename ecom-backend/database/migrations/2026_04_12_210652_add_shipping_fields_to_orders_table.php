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
        Schema::table('orders', function (Blueprint $table) {
        $table->string('shipping_name');
        $table->string('shipping_phone');
        $table->string('shipping_address_line_1');
        $table->string('shipping_city');
        $table->string('shipping_state');
        $table->string('shipping_pincode');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
            $table->dropColumn([
            'shipping_name',
            'shipping_phone',
            'shipping_address_line_1',
            'shipping_city',
            'shipping_state',
            'shipping_pincode',
        ]);
        });
    }
};
