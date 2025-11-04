<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $completedAppointments = Appointment::whereStatus('completed')->with('patientInfo')->get();

        foreach ($completedAppointments as $appointment) {
            $appointmentDate = Carbon::parse($appointment->appointment_date);

            $appointment->patientInfo->invoices()->create([
                'consultation_date' => $appointmentDate,
                'notes' => 'Invoice for appointment ID: '.$appointment->id.' with Dr. '.$appointment->employeeInfo->full_name,
                'due_date' => $appointmentDate->addDays(30),
                'amount' => fake()->randomFloat(2, 400, 600), // Random amount for demo purposes
                'payment_method' => fake()->randomElement(['credit_card', 'cash', 'insurance']),
                'status' => 'paid',
            ]);
        }
    }
}
