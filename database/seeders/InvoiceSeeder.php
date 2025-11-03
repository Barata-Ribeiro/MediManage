<?php

namespace Database\Seeders;

use App\Models\Appointment;
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
            $appointment->patientInfo->invoices()->create([
                'consultation_date' => $appointment->appointment_date,
                'notes' => 'Invoice for appointment ID: '.$appointment->id.' with Dr. '.$appointment->employeeInfo->full_name,
                'due_date' => now()->addDays(30),
                'amount' => fake()->randomFloat(2, 100, 500), // Random amount for demo purposes
                'payment_method' => fake()->randomElement(['credit_card', 'cash', 'insurance']),
                'status' => 'paid',
            ]);
        }
    }
}
