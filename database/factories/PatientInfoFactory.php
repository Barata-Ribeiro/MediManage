<?php

namespace Database\Factories;

use App\Models\PatientInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PatientInfo>
 */
class PatientInfoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Male', 'Female', 'Other']);

        $firstName = match ($gender) {
            'Male' => fake()->firstNameMale(),
            'Female' => fake()->firstNameFemale(),
            default => fake()->firstName(),
        };

        return [
            'first_name' => $firstName,
            'last_name' => fake()->lastName(),
            'gender' => $gender,
            'date_of_birth' => fake()->dateTimeBetween('-30 years', '-18 years')->format('Y-m-d'),
            'phone_number' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'insurance_company' => fake()->company(),
            'insurance_member_id_number' => fake()->bothify('??########'),
            'insurance_group_number' => fake()->bothify('??########'),
            'insurance_policy_number' => fake()->bothify('??########'),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_relationship' => fake()->randomElement(['Parent', 'Sibling', 'Spouse', 'Friend']),
            'emergency_contact_phone_number' => fake()->phoneNumber(),
            'allergies' => fake()->randomElement(['None', 'Peanuts', 'Penicillin', 'Pollen']),
            'current_medications' => fake()->randomElement(['None', 'Aspirin', 'Ibuprofen']),
            'past_illnesses' => fake()->randomElement(['None', 'Chickenpox', 'Measles']),
            'surgeries' => fake()->randomElement(['None', 'Appendectomy', 'Tonsillectomy']),
            'family_medical_history' => fake()->randomElement(['None', 'Diabetes', 'Heart Disease', 'Cancer']),
        ];
    }
}
