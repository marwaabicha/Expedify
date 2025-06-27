<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Models\User; // ton modèle User
use App\Mail\ResetPasswordMail;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            // On renvoie quand même succès pour ne pas exposer l'existence du mail
            return response()->json(['message' => 'Un lien de réinitialisation a été envoyé.']);
        }

        $token = Str::random(60);
        $now = Carbon::now();

        // Sauvegarde du token dans la table password_resets
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),  // on hash pour plus de sécurité
                'created_at' => $now,
            ]
        );

        // Envoi du mail avec le token en clair (pas hashé)
        Mail::to($request->email)->send(new ResetPasswordMail($token));

        return response()->json(['message' => 'Un lien de réinitialisation a été envoyé.']);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed', // confirmation_password
        ]);

        $passwordReset = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        // Vérification token (compare hash)
        if (!Hash::check($request->token, $passwordReset->token)) {
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        // Vérification expiration (1h)
        if (Carbon::parse($passwordReset->created_at)->addHour()->isPast()) {
            return response()->json(['message' => 'Lien expiré. Veuillez en redemander un nouveau.'], 400);
        }

        // Mise à jour du mot de passe
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Suppression du token pour ne pas réutiliser
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
}
