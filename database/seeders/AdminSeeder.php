<?php

namespace Database\Seeders;

use App\Models\EmployeeInfo;
use App\Models\User;
use Exception;
use Faker\Generator;
use Illuminate\Database\Seeder;
use Log;

class AdminSeeder extends Seeder
{
    private Generator $fake;

    public function __construct()
    {
        $this->fake = \Faker\Factory::create();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $admin = User::firstOrCreate(
                ['email' => config('app.admin_email')],
                [
                    'name' => config('app.admin_name'),
                    'email' => config('app.admin_email'),
                    'password' => config('app.admin_password'),
                ]
            )->assignRole('Super Admin');

            EmployeeInfo::create([
                'user_id' => $admin->id,
                'first_name' => config('app.admin_first_name'),
                'last_name' => config('app.admin_last_name'),
                'gender' => 'Male',
                'date_of_birth' => '1995-10-04',
                'phone_number' => $this->fake->phoneNumber(),
                'address' => $this->fake->address(),
                'position' => 'System Administrator',
                'is_active' => true,
                'hire_date' => now()->toDateString(),
            ]);

            $admin->update(['employee_info_id' => $admin->employeeInfo->id]);
        } catch (Exception $e) {
            Log::error('Error seeding users!', ['error' => $e->getMessage()]);
        }
    }
}
