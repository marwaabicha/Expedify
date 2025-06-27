<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auth extends Model
{
    
    protected $fillable = [
        'email',
        'password',
    ];
}
