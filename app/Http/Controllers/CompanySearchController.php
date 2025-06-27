<?php

namespace App\Http\Controllers;

use App\Models\Compagne;
use Illuminate\Http\Request;



class CompanySearchController extends Controller
{
    public function search(Request $request)
    {
        $transportType = $request->input('transport_methods'); // ex: "routier"
        $fromCountry = $request->input('from_country');
        $toCountry = $request->input('to_country');
        $weight = floatval($request->input('weight'));
        $maxPrice = floatval($request->input('max_price', 0)); // 0 = pas de limite

$results = Compagne::where('status', 'accepted')
    ->where('delivery_country', 'LIKE', "%{$fromCountry}%")
    ->where('delivery_country', 'LIKE', "%{$toCountry}%")
    ->whereJsonContains('transport_methods', $transportType)
    ->get()
    ->filter(function($company) use ($weight, $maxPrice) {
        $prices = json_decode($company->pricing_policy, true);
        $priceForWeight = 0;

        if ($weight <= 5) $priceForWeight = $prices['0-5'] ?? 0;
        else if ($weight <= 10) $priceForWeight = $prices['5-10'] ?? 0;
        else if ($weight <= 20) $priceForWeight = $prices['10-20'] ?? 0;
        else $priceForWeight = $prices['20+'] ?? 0;

        if ($maxPrice === 0) return true;
        return $priceForWeight <= $maxPrice;
    })
    ->values();


return response()->json($results);

    }
}


