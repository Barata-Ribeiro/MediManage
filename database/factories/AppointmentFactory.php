<?php

namespace Database\Factories;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = Carbon::instance($this->faker->dateTimeBetween('-1 years', '+1 years'));
        $hour = $this->faker->numberBetween(8, 16); // Business hours between 8 AM and 5 PM
        $minute = 0; // On the hour
        $appointmentDate = $date->setTime($hour, $minute, 0);

        $status = $appointmentDate->isPast()
            ? $this->faker->randomElement(['canceled', 'missed', 'completed'])
            : 'scheduled';

        return [
            'appointment_date' => $appointmentDate,
            'status' => $status,
            'reason_for_visit' => $this->faker->sentence(),
        ];
    }
}
