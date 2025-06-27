<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'company_id' => 'required|exists:companies,id',
        'sender_name' => 'required|string',
        'receiver_name' => 'required|string',
        'origin_country' => 'required|string',
        'destination_country' => 'required|string',
        'weight' => 'required|numeric|min:0.1',
        'transport_method' => 'required',
        'payment_method' => 'required',
    ]);

    $validated['user_id'] = auth()->id();

    $package = Package::create($validated);

    return response()->json([
        'message' => 'Colis envoyé avec succès',
        'package' => $package,
    ], 201);
}

public function sendPackage(Request $request)
{
    $validated = $request->validate([
        'company_id' => 'required|exists:companies,id',
        'sender_name' => 'required|string',
        'receiver_name' => 'required|string',
        'origin_country' => 'required|string',
        'destination_country' => 'required|string',
        'weight' => 'required|numeric|min:0.1',
        'transport_method' => 'required|string',
        'payment_method' => 'required|string',
    ]);

    $user = auth()->user();

    $package = new Package();
    $package->user_id = $user->id;
    $package->company_id = $validated['company_id'];
    $package->sender_name = $validated['sender_name'];
    $package->receiver_name = $validated['receiver_name'];
    $package->origin_country = $validated['origin_country'];
    $package->destination_country = $validated['destination_country'];
    $package->weight = $validated['weight'];
    $package->transport_method = $validated['transport_method'];
    $package->payment_method = $validated['payment_method'];
    $package->save();

    return response()->json(['message' => 'Demande enregistrée avec succès']);
}
// App\Http\Controllers\PackageController.php

public function getCompanyPackages(Request $request)
{
    $companyId = auth()->user()->company_id ?? $request->query('company_id');

    if (!$companyId) {
        return response()->json(['message' => 'Company ID not found'], 400);
    }

    // Récupérer les colis pour cette compagnie
    $packages = Package::where('company_id', $companyId)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($packages);
}


}
