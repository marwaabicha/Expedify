<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CompanyRequestController;
use App\Http\Controllers\CompanySearchController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\CompagneController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Models\CompanyRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




//login && signUp
Route::post('/signup', [UserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
//resetPassword
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
//Soumission de demande compagnie
Route::post('/companies', [CompagneController::class, 'store']);
//admin-demande
Route::get('/admin/company-requests', [CompanyRequestController::class, 'index']);
//admin-demande accepter ou refuser et somme
Route::put('/admin/company-requests/{id}', [CompanyRequestController::class, 'update']);
Route::get('/admin/company-requests/count', [CompanyRequestController::class, 'pendingCount']);
Route::get('/companies/active', [CompanyRequestController::class, 'activeCompanies']);
//demande Compagne marchandise && Acceptation ou refus
Route::post('/shipments', [ShipmentController::class, 'store']);
Route::get('/company/{id}/shipments', [ShipmentController::class, 'index']);
//recherche des compagnies
Route::post('/search-companies', [CompagneController::class, 'search']);
//chatbot
Route::post('/chat', [ChatbotController::class, 'handleChat']);
//gestion des problemes admin
Route::post('/problems', [ProblemController::class, 'store']);
Route::get('/admin/problems', [ProblemController::class, 'index']);
Route::put('/admin/problems/{id}', [ProblemController::class, 'updateStatus']);
//notification 
Route::get('/notifications/count', function () {
    $count = CompanyRequest::where('status', 'pending')->count();
    return response()->json(['count' => $count]);
});
//statistique admin && details
Route::get('/admin/stats', [AdminController::class, 'getStats']);
Route::get('/admin/company/{id}', [AdminController::class, 'getCompanyDetails']);
//lister les compagnies
Route::get('/companies', [CompagneController::class, 'getAcceptedCompanies']);
//selectionner une compagnie 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/companies/{id}', [CompagneController::class, 'show']);
    Route::post('/send-package', [PackageController::class, 'store']);
});
//resume dashboard company
Route::middleware('auth:sanctum')->get('/company-submissions', [CompagneController::class, 'getCompanySubmissions']);
Route::middleware('auth:sanctum')->get('/company-profile', [CompagneController::class, 'getProfile']);
//accepter ou refuser d'apres la compagnie marchandise 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/company-shipments', [ShipmentController::class, 'getCompanyShipments']);
    Route::post('/shipments/{id}/accept', [ShipmentController::class, 'acceptShipment']);
    Route::post('/shipments/{id}/reject', [ShipmentController::class, 'rejectShipment']);
});
Route::post('/compagnes', [CompagneController::class, 'index']);



//recherche compagnie search bar _acceuil
Route::post('/search', [CompanySearchController::class, 'search']);
Route::post('/search-compagnes', [CompanySearchController::class, 'search']);
//ordre search bar_acceuil
Route::middleware('auth:sanctum')->post('/orders', [OrderController::class, 'store']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
//Route ordres et tableau 
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'userOrders']);
});
//resume de compagne commande
Route::middleware('auth:sanctum')->get('/company/orders', [OrderController::class, 'companyOrders']);
Route::middleware('auth:sanctum')->put('/orders/{id}/mark-delivered', [OrderController::class, 'markDelivered']);
Route::middleware('auth:sanctum')->get('/orders/{id}', [OrderController::class, 'show']);




