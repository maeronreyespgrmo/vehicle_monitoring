<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::create('tbl_vehicle_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('driver_name')->nullable();
            $table->string('plate_no')->nullable();
            $table->string('vehicle_name')->nullable();
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('tbl_vehicle_registrations');
    }
};
