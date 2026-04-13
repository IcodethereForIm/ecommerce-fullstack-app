<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
    'user_id',
    'total_amount',
    'status',
    'payment_id',
    'order_id_gateway',

    'shipping_name',
    'shipping_phone',
    'shipping_address_line_1',
    'shipping_city',
    'shipping_state',
    'shipping_pincode',
];

public function items() {
    return $this->hasMany(OrderItem::class);
}

public function user() {
    return $this->belongsTo(User::class);
}
}
