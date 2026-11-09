<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    //
    protected $table = "tbl_vehicle_registrations";

    protected $fillable = [
        'driver_name',
        'plate_no',
        'address',
    ];
}
