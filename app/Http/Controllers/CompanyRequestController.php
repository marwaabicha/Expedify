<?php

namespace App\Http\Controllers;
use App\Models\Company;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\CompanyRequest;


class CompanyRequestController extends Controller
{
public function index()
{
    try {
        $requests = CompanyRequest::all();
        return response()->json($requests, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
public function update(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:accepted,rejected'
    ]);

    $companyRequest = CompanyRequest::findOrFail($id);
    $companyRequest->status = $request->status;
    $companyRequest->save();

    return response()->json(['message' => 'Statut mis à jour avec succès.']);
}
public function pendingCount(): JsonResponse
    {
        $count = CompanyRequest::where('status', 'pending')->count();

        return response()->json(['pending_count' => $count]);
    }
  public function activeCompanies(): JsonResponse
    {
        $companies = CompanyRequest::where('status', 'accepted')->get();

        return response()->json($companies);
 
    }

}
