<?php

namespace Database\Seeders;

use App\Models\MedicalRecord;
use App\Models\PatientInfo;
use Illuminate\Database\Seeder;

class MedicalRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PatientInfo::all()->each(fn($patient) => MedicalRecord::factory()->count(1)->create(['patient_info_id' => $patient->id]));
    }
}
