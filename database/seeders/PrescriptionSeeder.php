<?php

namespace Database\Seeders;

use App\Models\PatientInfo;
use App\Models\Prescription;
use App\Models\User;
use Exception;
use Illuminate\Database\Seeder;
use Log;

class PrescriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $drHouse = User::where('email', 'dr.housemd@ppth.com')->with('employeeInfo')->first();
            $patients = PatientInfo::all();

            Log::info('Seeding prescriptions for Dr. House and patients.', ['doctor_id' => $drHouse->id, 'patient_count' => $patients->count()]);
            Log::info('Doctor Info', ['employee_info_id' => $drHouse->employeeInfo->id]);

            $patients->each(function ($patient) use ($drHouse) {
                Prescription::factory()->count(3)->create([
                    'employee_info_id' => $drHouse->employeeInfo->id,
                    'patient_info_id' => $patient->id,
                ]);
            });

        } catch (Exception $e) {
            Log::error('Error seeding prescriptions!', ['error' => $e]);
        }
    }
}
