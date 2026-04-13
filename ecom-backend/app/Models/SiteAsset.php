<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteAsset extends Model
{
    //
    protected $fillable = [
    'section',
    'key',
    'asset_key',
    'image_id',
    'position'
    ];

    public function image()
{
    return $this->belongsTo(Image::class);
}
}
