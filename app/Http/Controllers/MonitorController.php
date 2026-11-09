<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitorController extends Controller
{
    //
    public function index()
    {
        
        return Inertia::render('parking_monitoring/index');
    }

    public function on_cam1()
    {
        
    }

    public function on_cam2()
    {

    }
    
    public function store(Request $request)
    {
        $vehicle = Vehicle::where('plate_no', $request->text)->first();

        return response()->json([
            'status' => 'ok',
            'vehicle' => $vehicle,
        ]);
    }
}
