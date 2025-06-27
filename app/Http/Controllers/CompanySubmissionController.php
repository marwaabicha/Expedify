<?php

namespace App\Http\Controllers;

use App\Models\CompanySubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class CompanySubmissionController extends Controller
{


public function index()
{
    $user = Auth::user();

    if ($user->type !== 'company') {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    // Récupère seulement les soumissions de cette entreprise
    $submissions = CompanySubmission::where('company_id', $user->id)->with('user')->get();

    return response()->json($submissions);
}

}
