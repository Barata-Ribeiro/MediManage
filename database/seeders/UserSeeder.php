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
                $user->assignRole('Patient');
            });

            User::factory()->count(4)->create()->each(function ($user) {
                $user->assignRole('Other Staff');
            });

            User::factory()->count(2)->create()->each(function ($user) {
                $user->assignRole('Attendant');
            });

            User::factory()->count(3)->create()->each(function ($user) {
                $user->assignRole('Doctor');
            });

            User::factory()->count(1)->create()->each(function ($user) {
                $user->assignRole('Manager');
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
