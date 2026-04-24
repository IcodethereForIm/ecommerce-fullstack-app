<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SiteAsset;


class Image extends Model
{
    //
    protected $fillable = [
        'file_path',
        'public_id',
        'alt_text'
    ];

    public function siteAssets()
    {
        return $this->hasMany(SiteAsset::class);
    }
}
