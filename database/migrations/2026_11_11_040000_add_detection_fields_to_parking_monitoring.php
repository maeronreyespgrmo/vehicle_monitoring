<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('parking_monitoring', function (Blueprint $table) {
            $table->foreignId('vehicle_id')
                ->nullable()
                ->after('id')
                ->constrained('tbl_vehicle_registrations')
                ->nullOnDelete();
            $table->string('plate_no', 50)->after('vehicle_id');
            $table->longText('plate_image')->nullable()->after('plate_no');
            $table->string('camera_id', 20)->nullable()->after('plate_image');
            $table->decimal('confidence', 5, 4)->nullable()->after('camera_id');
        });
    }

    public function down(): void
    {
        Schema::table('parking_monitoring', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn([
                'vehicle_id',
                'plate_no',
                'plate_image',
                'camera_id',
                'confidence',
            ]);
        });
    }
};
