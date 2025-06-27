<?php

namespace App\Http\Controllers;

use App\Models\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProblemController extends Controller
{
    // Créer un problème
    public function store(Request $request)
{
    // Étape 1 : Validation des données
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'category' => 'required|string|max:100',
        'urgency' => 'required|in:low,medium,high', // adapte les valeurs si besoin
        'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,docx|max:2048' // 2MB max par fichier
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    // Étape 2 : Gestion des fichiers
    $paths = [];
    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $paths[] = $file->store('problems', 'public');
        }
    }

    // Étape 3 : Création du problème
    $problem = Problem::create([
        'title' => $request->title,
        'description' => $request->description,
        'category' => $request->category,
        'urgency' => $request->urgency,
        'attachments' => json_encode($paths),
    ]);

    // Étape 4 : Retour JSON
    return response()->json([
        'status' => true,
        'message' => 'Problème enregistré avec succès',
        'data' => $problem
    ], 201);
}

    // Lister tous les problèmes
    public function index()
    {
        return Problem::with('user')->get();
    }

    // Mettre à jour le statut d'un problème
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:open,resolved',
        ]);

        $problem = Problem::findOrFail($id);
        $problem->status = $request->status;
        $problem->save();

        return response()->json(['message' => 'Problème mis à jour']);
    }
}
