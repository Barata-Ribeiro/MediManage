<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordEntry;
use App\Models\Appointment;
use App\Models\EmployeeInfo;
use Illuminate\Support\Carbon;
use Log;
use Exception;

class MedicalRecordEntriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $medicalRecords = MedicalRecord::with('patientInfo')->get();

            Log::info('Seeding medical record entries', ['medical_records_count' => $medicalRecords->count()]);

            $medicalRecords->each(function ($record) {
                // Only consider appointments that are checked_in or completed
                $appointments = Appointment::where('patient_info_id', $record->patient_info_id)
                    ->whereIn('status', ['checked_in', 'completed'])
                    ->get();

                $appointment = $appointments->isNotEmpty() ? $appointments->random() : null;

                if (!$appointment) {
                    return;
                }

                $doctor = EmployeeInfo::find($appointment->employee_info_id);

                if (!$doctor) {
                    return;
                }

                // Create between 1 and 5 entries for each medical record
                $count = rand(1, 5);

                MedicalRecordEntry::factory()->count($count)->create([
                    'medical_record_id' => $record->id,
                    'employee_info_id' => $doctor?->id,
                    'appointment_id' => $appointment?->id,
                ])->each(function ($entry) use ($appointment) {
                    if ($appointment) {
                        $apptDate = Carbon::parse($appointment->appointment_date);

                        $entry->update([
                            'created_at' => $apptDate->copy()->subDays(rand(0, 10)),
                            'updated_at' => $apptDate,
                        ]);
                    }
                });
            });

            Log::info('Seeded medical record entries successfully.');
        } catch (Exception $e) {
            Log::error('Error seeding medical record entries', ['error' => $e->getMessage()]);
        }
    }
}
