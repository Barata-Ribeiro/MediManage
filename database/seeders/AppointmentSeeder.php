<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Log;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $patients = PatientInfo::all();
            $doctors = EmployeeInfo::whereHas('user', fn ($q) => $q->role('Doctor'))->get();

            Log::info('Seeding appointments for patients and doctors.', [
                'patients_count' => $patients->count(),
                'doctors_count' => $doctors->count(),
            ]);
            $patients->each(function ($patient) use ($doctors) {
                $doctor = $doctors->random();

                Appointment::factory()->count(5)->create([
                    'patient_info_id' => $patient->id,
                    'employee_info_id' => $doctor->id,
                ])->each(function ($appointment) {
                    $currentDate = Carbon::parse($appointment->appointment_date);
                    $currentStatus = $appointment->status;
                    $isScheduled = $currentStatus === 'scheduled';

                    $appointment->update([
                        'created_at' => $isScheduled ? $currentDate : $currentDate->copy()->subDays(rand(1, 10)),
                        'updated_at' => $currentDate,
                    ]);
                });
            });
        } catch (Exception $e) {
            Log::error('Error seeding appointment!', ['error' => $e]);
        }
    }
}
