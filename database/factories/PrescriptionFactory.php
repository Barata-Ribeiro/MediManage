<?php

namespace Database\Factories;

use App\Models\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prescription>
 */
class PrescriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dateIssued = $this->faker->dateTimeBetween('-1 years', 'now');
        $dateExpires = $this->faker->dateTimeBetween($dateIssued, '+6 months');

        return [
            'prescription_details_html' => $this->faker->paragraphs(2, true),
            'date_issued' => $dateIssued->format('Y-m-d'),
            'date_expires' => $dateExpires->format('Y-m-d'),
        ];
    }
}
