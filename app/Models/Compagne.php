<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compagne extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'company_name', 'description', 'logo_path', 'logo_url', 'min_order_value', 'delivery_country',
        'transport_type', 'terms_path', 'payment_methods', 'email', 'phone', 'website', 'address',
        'accepted_terms', 'accepted_privacy_policy','status', 
        'pricing_policy',
    ];


    protected $casts = [
    'delivery_country' => 'array',
    'transport_type' => 'array',
    'payment_methods' => 'array',
    'pricing_policy' => 'array',
    'accepted_terms' => 'boolean',
    'accepted_privacy_policy' => 'boolean',
];

    public function order()
{
    return $this->hasMany(Order::class);
}
}
