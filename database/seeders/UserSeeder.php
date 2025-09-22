<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => config('app.admin_email')],
            [
                'name' => config('app.admin_name'),
                'email' => config('app.admin_email'),
                'password' => config('app.admin_password'),
            ]
        );
    }
}
