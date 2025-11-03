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

            // Specific patient for login and testing
            User::firstOrCreate(
                ['email' => 'tribbiani@estelleagency.com'],
                [
                    'name' => 'joeytribbiani',
                    'email' => 'tribbiani@estelleagency.com',
                    'password' => config('app.admin_password'),
                    'avatar' => 'https://media.licdn.com/dms/image/v2/C5112AQEgwYpYwOEYCw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520089367852?e=2147483647&v=beta&t=3hWnvOr-xyYEtpJPI6YMc54tKeiApvsHIL8YU40S2lE',
                ]
            )->assignRole('Patient');

            // Specific doctor for login and testing
            User::firstOrCreate(
                ['email' => 'dr.housemd@ppth.com'],
                [
                    'name' => 'dr.housemd',
                    'email' => 'dr.housemd@ppth.com',
                    'password' => config('app.admin_password'),
                    'avatar' => 'https://garrisonmarketinggroup.com/wp-content/uploads/2022/05/0003_article-dr-house-netflix.jpg',
                ]
            )->assignRole('Doctor');

            // Specific attendant user for testing
            User::firstOrCreate(
                ['email' => 'pam.beesly@dunder-mifflin.com'],
                [
                    'name' => 'pam.beesly',
                    'email' => 'pam.beesly@dunder-mifflin.com',
                    'password' => config('app.admin_password'),
                    'avatar' => 'https://static0.colliderimages.com/wordpress/wp-content/uploads/2025/09/the-office-jenna-fischer-2.jpg',
                ]
            )->assignRole('Attendant');

            // Specific manager user for testing
            User::firstOrCreate(
                ['email' => 'tone@dimeofamily.com'],
                [
                    'name' => 'tony-soprano',
                    'email' => 'tone@dimeofamily.com',
                    'password' => config('app.admin_password'),
                    'avatar' => 'https://static.wikia.nocookie.net/sopranos/images/8/8c/Tony_Soprano_Season_1.png',
                ]
            )->assignRole('Manager');

            // Banned user for testing
            User::firstOrCreate(
                ['email' => 'banned_user@example.com'],
                [
                    'name' => 'banned_user',
                    'email' => 'banned_user@example.com',
                    'password' => config('app.admin_password'),
                ]
            )->assignRole('Banned');

            Log::info('Seeded users with roles.');
        } catch (Exception $e) {
            Log::error('Error seeding users!', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Add a random number of days (0-30) to a date string.
     */
    private function addRandomDays(): string
    {
        return '+'.rand(0, 30).' days';
    }
}
