<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Company;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'type' => 'required|in:personal,company',
        ]);

        $email = $request->email;
        $password = $request->password;
        $type = $request->type;

        if ($type === 'personal') {
            $user = User::where('email', $email)->first();
        } else {
            $user = Company::where('email', $email)->first();
        }

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'type' => $type,
        ]);
    }
}
