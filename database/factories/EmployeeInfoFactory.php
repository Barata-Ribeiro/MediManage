<?php

namespace Database\Factories;

use App\Models\EmployeeInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeInfo>
 */
class EmployeeInfoFactory extends Factory
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
            'date_of_birth' => fake()->dateTimeBetween('-50 years', '-20 years')->format('Y-m-d'),
            'phone_number' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'is_active' => true, // Only active employees in factory
            'hire_date' => fake()->dateTimeBetween('-10 years', 'now')->format('Y-m-d'),
            'termination_date' => null, // Only active employees in factory
        ];
    }

    /**
     * Set the employee position based on a Spatie role name.
     *
     * Usage in seeder:
     * EmployeeInfo::factory()->forRole('Doctor')->create();
     *
     * @param string $role
     * @return static
     */
    public function forRole(string $role): static
    {
        $normalized = strtolower(trim($role));

        $mappedPosition = match ($normalized) {
            'doctor' => 'Doctor',
            'attendant' => 'Attendant',
            'manager' => 'Manager',
            default => fake()->randomElement(['Janitor', 'Technician']),
        };

        return $this->state(fn(array $attributes) => [
            'position' => $mappedPosition,
            'registration_number' => $mappedPosition === 'Doctor' ? fake()->bothify('??########') : '',
            'registration_origin' => $mappedPosition === 'Doctor' ? fake()->company() : '',
            'specialization' => $mappedPosition === 'Doctor' ? fake()->randomElement(['General Practitioner', 'Surgeon', 'Pediatrician', 'Cardiologist', 'Dermatologist', 'Pneumologist']) : '',
            'license_number' => $mappedPosition === 'Doctor' ? fake()->bothify('??########') : '',
            'license_expiry_date' => $mappedPosition === 'Doctor' ? fake()->dateTimeBetween('+1 years', '+10 years')->format('Y-m-d') : '',
        ]);
    }
}
