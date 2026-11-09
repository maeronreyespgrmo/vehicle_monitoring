<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\UserController;


Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
   Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
   Route::get('/vehicle', [VehicleController::class, 'index'])->name('vehicle');
   Route::get('/vehicle/create', [VehicleController::class, 'create'])->name('vehicle_create');
   Route::post('/vehicle/store', [VehicleController::class, 'store'])->name('vehicle_store');
   Route::get('/vehicle/edit/{id}', [VehicleController::class, 'edit'])->name('vehicle_edit');
   Route::post('/vehicle/update', [VehicleController::class, 'update'])->name('vehicle_update');
   Route::post('/vehicle/destroy', [VehicleController::class, 'destroy'])->name('vehicle_destroy');

   Route::get('/monitor', [MonitorController::class, 'index'])->name('monitor');
   //USERS
   Route::get('/user', [UserController::class, 'index'])->name('user');
   Route::get('/user/create', [UserController::class, 'create'])->name('user_create');
   Route::post('/user/store', [UserController::class, 'store'])->name('user_store');
   Route::get('/user/edit/{id}', [UserController::class, 'edit'])->name('user_edit');
   Route::post('/user/update', [UserController::class, 'update'])->name('user_update');
   Route::post('/user/destroy', [UserController::class, 'destroy'])->name('user_destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
