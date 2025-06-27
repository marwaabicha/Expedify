<?php

namespace App\Http\Controllers;
 use App\Models\Compagne;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Problem;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminController extends Controller
{
   

public function getStats()
{
    $today = Carbon::today();
    $weekAgo = Carbon::now()->subDays(7);

    $problems = Problem::selectRaw('DATE(created_at) as date, COUNT(*) as count')
        ->whereBetween('created_at', [$weekAgo, $today])
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    $requests = DB::table('companies')
        ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
        ->whereBetween('created_at', [$weekAgo, $today])
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    return response()->json([
        'problems' => $problems,
        'requests' => $requests
    ]);
}
public function getCompanyDetails($id)
{
    $company = Compagne::findOrFail($id);
    return response()->json($company);
}


}