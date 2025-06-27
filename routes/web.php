<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/test-mail', function () {
    Mail::to('you@example.com')->send(new \App\Mail\ResetPasswordMail('demo_token'));
    return 'Email envoyé.';
});

Route::get('/', function () {
    return view('welcome');
});
Route::get('/test', function () {
    return view('welcome');
});
// Route::get('/users', [UserController::class, 'index']);

// Route::get('/signup', [UserController::class, 'signup']);