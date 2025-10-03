<?php

namespace Database\Seeders;

use App\Models\User;
use Exception;
use Illuminate\Database\Seeder;
use Log;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            User::factory()->count(15)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween('-1 years', 'now');
                $updatedAt = (clone $createdAt)->modify('+' . rand(0, 30) . ' days');

                $user->assignRole('Patient');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(4)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween('-1 years', 'now');
                $updatedAt = (clone $createdAt)->modify('+' . rand(0, 30) . ' days');

                $user->assignRole('Other Staff');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(2)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween('-1 years', 'now');
                $updatedAt = (clone $createdAt)->modify('+' . rand(0, 30) . ' days');

                $user->assignRole('Attendant');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(3)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween('-1 years', 'now');
                $updatedAt = (clone $createdAt)->modify('+' . rand(0, 30) . ' days');

                $user->assignRole('Doctor');
                $user->created_at = $createdAt;
                $user->updated_at = $updatedAt;
                $user->saveQuietly();
            });

            User::factory()->count(1)->create()->each(function ($user) {
                $createdAt = fake()->dateTimeBetween('-1 years', 'now');
                $updatedAt = (clone $createdAt)->modify('+' . rand(0, 30) . ' days');

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
        } catch (Exception $e) {
            Log::error('Error seeding users!', ['error' => $e->getMessage()]);
        }
    }
}
