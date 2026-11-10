<?php

namespace App\Http\Controllers;

use App\Models\ParkingMonitoring;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitorController extends Controller
{
    //
    public function index()
    {
        $vehiclesByPlate = Vehicle::query()
            ->get(['id', 'driver_name', 'plate_no', 'vehicle_name'])
            ->keyBy(fn (Vehicle $vehicle) => $this->normalizePlateNo($vehicle->plate_no));

        $monitoring = ParkingMonitoring::query()
            ->with('vehicle:id,driver_name,plate_no,vehicle_name')
            ->latest()
            ->limit(100)
            ->get()
            ->map(function (ParkingMonitoring $record) use ($vehiclesByPlate) {
                $vehicle = $record->vehicle
                    ?? $vehiclesByPlate->get($this->normalizePlateNo($record->plate_no));

                return [
                    'id' => $record->id,
                    'driver_name' => $vehicle?->driver_name,
                    'plate_no' => $record->plate_no,
                    'vehicle_name' => $vehicle?->vehicle_name,
                    'plate_image' => $record->plate_image,
                    'camera_id' => $record->camera_id,
                    'confidence' => $record->confidence,
                    'created_at' => $record->created_at?->toISOString(),
                ];
            });

        return Inertia::render('parking_monitoring/index', [
            'monitoring' => $monitoring,
        ]);
    }

    public function on_cam1()
    {
        
    }

    public function on_cam2()
    {

    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:50'],
            'plate_image' => ['nullable', 'string'],
            'camera_id' => ['nullable', 'integer', 'in:1,2'],
            'confidence' => ['nullable', 'numeric', 'between:0,1'],
        ]);

        $plateNo = strtoupper(trim($validated['text']));
        $normalizedPlateNo = $this->normalizePlateNo($plateNo);
        $vehicle = Vehicle::query()
            ->whereRaw(
                "REPLACE(REPLACE(UPPER(plate_no), '-', ''), ' ', '') = ?",
                [$normalizedPlateNo]
            )
            ->first();

        $monitoring = ParkingMonitoring::create([
            'vehicle_id' => $vehicle?->id,
            'plate_no' => $plateNo,
            'plate_image' => $validated['plate_image'] ?? null,
            'camera_id' => $validated['camera_id'] ?? null,
            'confidence' => $validated['confidence'] ?? null,
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Plate detection saved.',
            'monitoring' => $monitoring,
            'vehicle' => $vehicle,
        ], 201);
    }

    private function normalizePlateNo(?string $plateNo): string
    {
        return preg_replace('/[^A-Z0-9]/', '', strtoupper($plateNo ?? ''));
    }
}
