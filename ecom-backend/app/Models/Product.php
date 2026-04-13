<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //

    protected $fillable = [
        'name',
        'slug',
        'sku',
        
        'category_id',
        "product_type",
        "price",
        "description",
        'sale_price',
        'description',
        'thumbnail',
        'is_active',
        'is_featured',
        
    ];

   public function images()
{
    return $this->hasMany(ProductImage::class);
}
public function sizes() {
    return $this->hasMany(ProductSize::class);
}
public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
