<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class VehicleRegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $file = database_path('seeders/data/plate_no.csv');

        if (!file_exists($file) || !is_readable($file)) {
            return;
        }

        $header = null;
        $data = [];

        if (($handle = fopen($file, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {

                if (!$header) {
                    $header = $row; // first row = column names
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }

        foreach ($data as $row) {
            DB::table('tbl_vehicle_registrations')->insert([
                'driver_name' => $row['driver_name'],
                'vehicle_name' => $row['vehicle_name'],
                'plate_no' => $row['plate_no'],
            ]);
        }
    }
}
