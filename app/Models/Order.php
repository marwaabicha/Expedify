<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Str;

class Order extends Model
{
    protected $guarded=[];
    public function compagne()
{
    return $this->belongsTo(Compagne::class, 'company_id');
}
protected static function boot()
{
    parent::boot();

    static::creating(function ($order) {
        $order->order_code = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    });
}


}
