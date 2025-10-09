<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trainees;
use App\Models\User;
use App\Models\ListProgram;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //   
    public function index(Trainees $trainees)
    {
        $total = User::select("id")->count();

        $lists = ListProgram::select("id")->count();
        // return$total;

           return Inertia::render('dashboard', [
           
                'total' => $total,
                'lists' => $lists,

            
        ]);
    }
}
