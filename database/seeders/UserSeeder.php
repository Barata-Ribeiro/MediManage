<?php

namespace Database\Seeders;

use App\Models\User;
use Exception;
use Illuminate\Database\Seeder;
use Log;

const START_DATE = '-1 years';

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            User::factory()->count(60)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween(START_DATE, 'now');
                $updatedAt = (clone $createdAt)->modify($this->addRandomDays());

                $user->assignRole('Patient');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(4)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween(START_DATE, 'now');
                $updatedAt = (clone $createdAt)->modify($this->addRandomDays());

                $user->assignRole('Other Staff');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(2)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween(START_DATE, 'now');
                $updatedAt = (clone $createdAt)->modify($this->addRandomDays());

                $user->assignRole('Attendant');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(3)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween(START_DATE, 'now');
                $updatedAt = (clone $createdAt)->modify($this->addRandomDays());

                $user->assignRole('Doctor');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(1)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween(START_DATE, 'now');
                $updatedAt = (clone $createdAt)->modify($this->addRandomDays());

                $user->assignRole('Manager');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            // Specific user for login and testing
            User::firstOrCreate(
                ['email' => "dr.housemd@ppth.com"],
                [
                    'name' => "dr.housemd",
                    'email' => "dr.housemd@ppth.com",
                    'password' => config('app.admin_password'),
                ]
            )->assignRole('Doctor');

            Log::info('Seeded users with roles.');
        } catch (Exception $e) {
            Log::error('Error seeding users!', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Add a random number of days (0-30) to a date string.
     *
     * @return string
     */
    private function addRandomDays(): string
    {
        return '+' . rand(0, 30) . ' days';
    }
}
