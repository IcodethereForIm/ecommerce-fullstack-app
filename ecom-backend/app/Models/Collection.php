<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    //
    protected $fillable = [
    'slug', 'title', 'layout', 'show_banner',
    'show_products', 'components', 'is_active'
];

protected $casts = [
    'components' => 'array',   // JSON will auto-cast to array
    'show_banner' => 'boolean',
    'show_products' => 'boolean',
    'is_active' => 'boolean'
];
}
