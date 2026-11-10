<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingMonitoring extends Model
{
    protected $table = 'parking_monitoring';

    protected $fillable = [
        'vehicle_id',
        'plate_no',
        'plate_image',
        'camera_id',
        'confidence',
    ];

    protected function casts(): array
    {
        return [
            'confidence' => 'float',
        ];
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
