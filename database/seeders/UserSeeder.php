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
            User::firstOrCreate(
                ['email' => config('app.admin_email')],
                [
                    'name' => config('app.admin_name'),
                    'email' => config('app.admin_email'),
                    'password' => config('app.admin_password'),
                ]
            )->assignRole('Super Admin');
        } catch (Exception $e) {
            Log::error('Error seeding users!', ['error' => $e->getMessage()]);
        }
    }
}
