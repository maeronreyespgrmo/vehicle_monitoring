<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trainees;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //   
    public function index(Trainees $trainees)
    {
        $total = Vehicle::select("id")->count();

        // $lists = Vehicle::select("id")->count();
        // return $lists;

           return Inertia::render('dashboard', [
                'total' => $total,
                // 'lists' => $lists,
        ]);
    }
}
