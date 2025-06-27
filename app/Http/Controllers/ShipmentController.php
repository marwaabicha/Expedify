<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'company_id' => 'required|exists:companies,id',
        'contact' => 'required|string',
        'phone' => 'required|string',
        'country_from' => 'required|string',
        'country_to' => 'required|string',
        'city_from' => 'required|string',
        'city_to' => 'required|string',
        'weight' => 'required|string',
        'service' => 'required|in:express,economique,standard',
        'freight_type' => 'required|in:aerien,maritime,routier,ferroviaire',
    ]);

    $shipment = Shipment::create($validated);

    return response()->json(['message' => 'Demande envoyée avec succès', 'data' => $shipment], 201);
}
 public function getCompanyShipments(Request $request)
    {
        $company = $request->user();

        if (!$company) {
            return response()->json(['message' => 'Non autorisé'], 401);
        }

        $shipments = Shipment::where('company_id', $company->id)->latest()->get();

        return response()->json($shipments);
    }
    

    // Méthode pour accepter une expédition
    public function acceptShipment(Request $request, $id)
    {
        $company = $request->user();

        $shipment = Shipment::where('company_id', $company->id)->where('id', $id)->first();

        if (!$shipment) {
            return response()->json(['message' => 'Expédition non trouvée'], 404);
        }

        $shipment->status = 'accepted';
        $shipment->save();

        return response()->json(['message' => 'Expédition acceptée', 'shipment' => $shipment]);
    }

    // Méthode pour refuser une expédition
    public function rejectShipment(Request $request, $id)
    {
        $company = $request->user();

        $shipment = Shipment::where('company_id', $company->id)->where('id', $id)->first();

        if (!$shipment) {
            return response()->json(['message' => 'Expédition non trouvée'], 404);
        }

        $shipment->status = 'rejected';
        $shipment->save();

        return response()->json(['message' => 'Expédition refusée', 'shipment' => $shipment]);
    }
}
