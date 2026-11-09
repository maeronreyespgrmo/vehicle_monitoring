<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicle = Vehicle::all();

        return Inertia::render('vehicle_registration/index',[
                'vehicle' => $vehicle,
        ]);
    }
    
    public function create()
    {
        return Inertia::render('vehicle_registration/create');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'driver_name' => 'required|string|max:255',
            'plate_no' => 'required|string|max:50',
            'vehicle_name' => 'required|string|max:255',
        ]);

        // Store the vehicle data in the database
        Vehicle::create($validated);

        // Redirect or return a response
        return redirect()->route('vehicle')->with('success', 'Vehicle registered successfully.');
    }

    public function edit($id)
    {
        $vehicle = Vehicle::find($id);

        return Inertia::render('vehicle_registration/edit',[
                'vehicle_edit' => $vehicle,
        ]);
    }

    public function update(Request $request)
    {
        Vehicle::where('id', $request->id)->update([
            'driver_name' => $request->driver_name,
            'plate_no' => $request->plate_no,
            'vehicle_name' => $request->vehicle_name,
        ]);

        return "success";
    }

    public function destroy(Request $request)
    {
        Vehicle::where('id', $request->id)->delete();
        return "success";
    }
}

