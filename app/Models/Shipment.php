<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = [
        'company_id', 'contact', 'phone', 'country_from', 'country_to',
        'city_from', 'city_to', 'weight', 'service', 'freight_type', 'status'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
