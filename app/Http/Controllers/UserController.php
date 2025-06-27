<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)

    {
        if ($request->type === 'personal') {
            $request->validate([
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]);

            User::create([
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'Compte personnel créé.'], 201);

        } elseif ($request->type === 'company') {
            $request->validate([
                'company_name' => 'required|string|max:255',
                'email' => 'required|email|unique:companies,email',
                'password' => 'required|min:6',
            ]);

            Company::create([
                'company_name' => $request->company_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'Compte entreprise créé.'], 201);
        }

        return response()->json(['message' => 'Type de compte invalide.'], 422);
    }
}
