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
        Schema::table('site_assets', function (Blueprint $table) {
            //
            $table->string('asset_key')->default('primary')->after('key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_assets', function (Blueprint $table) {
            //
            $table->dropColumn('asset_key');
        });
    }
};
