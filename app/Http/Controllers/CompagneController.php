<?php

namespace App\Http\Controllers;

use App\Models\Compagne;
use App\Models\Package;
use App\Models\Submission;
use Illuminate\Http\Request;

class CompagneController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'companyName' => 'required|string|max:255',
            'description' => 'required|string',
            'logoFile' => 'nullable|file|image|max:2048',
            'logoUrl' => 'nullable|url',
            'minOrderValue' => 'nullable|numeric',
            'deliveryCountry' => 'required|string|max:255',
            'transportMethods' => 'nullable|array',
            'transportMethods.*' => 'string',
            'termsFile' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'paymentMethods' => 'nullable|array',
            'email' => 'required|email',
            'phone' => 'required|string|max:30',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'acceptedTerms' => 'required|boolean',
            'acceptedPrivacyPolicy' => 'required|boolean',
            'transport_type' => 'required|string',
        ]);

        // Upload logo if present
        $logoPath = null;
        if ($request->hasFile('logoFile')) {
            $logoPath = $request->file('logoFile')->store('logos', 'public');
        }

        // Upload terms file
        $termsPath = $request->file('termsFile')->store('terms', 'public');

        $company = Compagne::create([
            'company_name' => $validated['companyName'],
            'description' => $validated['description'],
            'logo_path' => $logoPath,
            'logo_url' => $validated['logoUrl'] ?? null,
            'min_order_value' => $validated['minOrderValue'] ?? null,
            'delivery_country' => $validated['deliveryCountry'],
            'transport_methods' => $validated['transportMethods'] ?? [],
            'terms_path' => $termsPath,
            'payment_methods' => $validated['paymentMethods'] ?? [],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'website' => $validated['website'] ?? null,
            'address' => $validated['address'] ?? null,
            'accepted_terms' => $validated['acceptedTerms'],
            'accepted_privacy_policy' => $validated['acceptedPrivacyPolicy'],
    
            'pricing_policy' => json_encode([
                '0-5' => 10,
                '5-10' => 18,
                '10-20' => 30,
                '20+' => 50
            ]),
        ]);
        \Log::info('Requête reçue', $request->all());

        return response()->json(['message' => 'Demande reçue avec succès', 'company' => $company], 201);
    }

    public function calculateShippingPrice($weight, $pricingPolicy)
    {
        foreach ($pricingPolicy as $range => $price) {
            if (strpos($range, '+') !== false) {
                $min = (int) str_replace('+', '', $range);
                if ($weight >= $min) return $price;
            } elseif (strpos($range, '-') !== false) {
                [$min, $max] = array_map('intval', explode('-', $range));
                if ($weight >= $min && $weight <= $max) return $price;
            }
        }
        return null; // Si aucune correspondance
    }

    public function search(Request $request)
{
    $request->validate([
        'from_country' => 'required|string',
        'to_country' => 'required|string',
        'weight' => 'required|numeric|min:0',
        'max_price' => 'required|numeric|min:0',
        'transport_type' => 'required|string',
    ]);

    $from = $request->input('from_country');
    $to = $request->input('to_country');
    $weight = $request->input('weight');
    $maxPrice = $request->input('max_price');
    $transportType = $request->input('transport_type');


    $companies = Compagne::where(function($query) use ($from, $to) {
        $query->where('delivery_country', 'LIKE', "%$from%")
              ->orWhere('delivery_country', 'LIKE', "%$to%");
    })->where('transport_type', $transportType)
    ->get();

    $results = $companies->map(function ($company) use ($from, $to, $weight, $maxPrice) {
        $policy = json_decode($company->pricing_policy, true);
        $shipping_price = $policy ? $this->calculateShippingPrice($weight, $policy) : null;

        // Ne pas retourner la compagnie si le prix dépasse max_price
        if ($shipping_price === null || $shipping_price > $maxPrice) {
            return null;
        }

        return [
            'id' => $company->id,
            'company_name' => $company->company_name,
            'logo_url' => $company->logo_path ? asset('storage/' . $company->logo_path) : null,
            'from_country' => $from,
            'to_country' => $to,
            'transport_methods' => $company->transport_methods,
            'transport_type' => $company->transport_type ?? null,
            'rating' => $company->rating ?? null,
            'shipping_price' => $shipping_price,
        ];
    })->filter()->values(); // filter() supprime les null, values() réindexe

    return response()->json($results);
}
public function getAcceptedCompanies(Request $request)
{
    $query = Compagne::where('status', 'accepted');

    if ($request->has('company_name')) {
        $query->where('company_name', 'like', '%' . $request->company_name . '%');
    }

    if ($request->has('rating')) {
        $query->where('rating', '>=', $request->rating); 
    }

    if ($request->has('min_order_value')) {
        $query->where('min_order_value', '<=', $request->min_order_value); 
    }

    if ($request->has('has_relay_points')) {
        $query->where('has_relay_points', $request->has_relay_points); 
    }

    return response()->json($query->get());
}
public function show($id)
{
    $company = Compagne::findOrFail($id);

    return response()->json([
        'id' => $company->id,
        'company_name' => $company->company_name,
        'transport_methods' => $company->transport_methods,
        'payment_methods' => $company->payment_methods,
        'origin_countries' => $company->origin_countries,
        'delivery_countries' => $company->delivery_countries,
        'pricing_policy' => $company->pricing_policy,
    ]);
}
  public function getCompanySubmissions()
{
    $company = auth()->user(); // Si l'admin de la compagnie est connecté

    $packages = Package::where('company_id', $company->id)
        ->latest()
        ->get();

    return response()->json($packages);
}
public function getProfile(Request $request)
    {
        $company = $request->user();  // Utilisateur connecté (compagnie)

        if (!$company) {
            return response()->json(['message' => 'Non autorisé'], 401);
        }

        return response()->json([
            'id' => $company->id,
            'company_name' => $company->company_name,
            // ajoute ici les autres infos que tu veux retourner
        ]);
    }



}
