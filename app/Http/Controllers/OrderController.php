<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use \Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:compagnes,id',
            'from_country' => 'required|string',
            'to_country' => 'required|string',
            'weight' => 'required|numeric',
            'estimated_price' => 'required|numeric',
            'transport_type' => 'required|string',
            'recipient_name' => 'required|string',
            'payment_method' => 'required|string',
        ]);

         $orderCode = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        $order = Order::create([
            'company_id' => $request->company_id,
            'from_country' => $request->from_country,
            'to_country' => $request->to_country,
            'weight' => $request->weight,
            'order_code' => $orderCode,
            'estimated_price' => $request->estimated_price,
            'transport_type' => $request->transport_type,
            'recipient_name' => $request->recipient_name,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Commande créée avec succès', 'order' => $order]);
    }
    public function userOrders(Request $request)
{
    
    $orders = Order::with('compagne')
        ->where('user_id',  $request->user()->id)
        ->latest()
        ->get();

    return response()->json($orders);
}
public function companyOrders(Request $request)
{
    $company = auth()->user()->company; // si l'utilisateur est une compagnie

    $orders = Order::with('user')
        ->where('company_id', $company->id)
        ->get();

    return response()->json($orders);
}
public function markDelivered($id)
{
    $order = Order::findOrFail($id);

    // Facultatif : vérifier que l'utilisateur est la compagnie liée
    if ($order->company_id !== auth()->user()->company->id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $order->status = 'delivered';
    $order->save();

    return response()->json(['message' => 'Order marked as delivered']);
}
public function show($id)
{
    $order = Order::with('compagne') // si tu veux inclure les détails de la compagnie
                  ->find($id);

    if (!$order) {
        return response()->json(['message' => 'Commande non trouvée'], 404);
    }

    return response()->json($order);
}

}
