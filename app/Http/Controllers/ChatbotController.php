<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
    use Illuminate\Support\Facades\Log;
class ChatbotController extends Controller
{


public function handleChat(Request $request)
{
    $request->validate([
        'message' => 'required|string',
    ]);

    $message = $request->input('message');

    try {
        $response = Http::withHeaders([
    'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
    'Content-Type' => 'application/json',
])->post('https://api.openai.com/v1/chat/completions', [
    'model' => 'gpt-4o',
    'messages' => [
        [
            'role' => 'system',
            'content' => "Tu es ExpedifyBot, un assistant spécialisé dans la plateforme Expedify..."
        ],
        ['role' => 'user', 'content' => $message],
    ],
]);

// Ajoute ceci pour voir la vraie erreur
if ($response->failed()) {
    dd($response->json());
}


        $data = $response->json();
        $reply = $data['choices'][0]['message']['content'] ?? "Je n’ai pas compris. Pose une question liée à Expedify.";

        return response()->json([
            'reply' => $reply
        ]);
    } catch (\Exception $e) {
        Log::error('Erreur Laravel:', ['message' => $e->getMessage()]);
        return response()->json([
            'reply' => 'Erreur du serveur Laravel.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
