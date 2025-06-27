<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class Company extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $fillable = [
        'company_name',
        'email',
        'password',
    ];

 

}
