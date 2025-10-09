<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Trainees extends Model
{
    //
    use HasFactory;
    protected $table = "tbl_trainees";
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'school_attainment',
        'birthdate',
        'gender',
        'email',
        'civil_stat',
        'mobile_no',
        'status',
        'street',
        'house_number',
        'province_code',
        'town_code',
        'barangay_code',
        'image'
    ];
}
