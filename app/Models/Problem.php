<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
   use HasFactory;

   protected $guarded=[];
   protected $casts = [
    'attachments' => 'array',
];


    // Relation vers l'utilisateur qui a soumis le problème
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
