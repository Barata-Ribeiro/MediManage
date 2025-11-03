<?php

namespace Database\Seeders;

use App\Models\EmployeeInfo;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (EmployeeInfo::all() as $employee) {
            $employeePosition = $employee->position;

            $rate = match ($employeePosition) {
                'Doctor' => 8000,
                'Attendant' => 5500,
                'Manager' => 10000,
                default => fake()->numberBetween(3000, 5000),
            };

            $employee->contracts()->create([
                'start_date' => $employee->hire_date,
                'end_date' => Carbon::parse($employee->hire_date)->addYear(),
                'rate_type' => 'monthly',
                'rate' => $rate,
                'contract_type' => 'full_time',
            ]);
        }
    }
}
