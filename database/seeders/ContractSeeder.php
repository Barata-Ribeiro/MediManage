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
        $now = Carbon::today();

        foreach (EmployeeInfo::all() as $employee) {
            $employeePosition = $employee->position;

            $rate = match ($employeePosition) {
                'Doctor' => 7500,
                'Attendant' => 2500,
                'Manager' => 5000,
                default => fake()->numberBetween(2000, 4000),
            };

            $hireDate = Carbon::parse($employee->hire_date);
            $startDate = $hireDate->copy();

            while ($startDate->lessThan($now)) {
                $endDate = $startDate->copy()->addYear();

                if ($endDate->greaterThan($now)) {
                    $endDate = $now->copy();
                }

                $employee->contracts()->create([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'rate_type' => 'monthly',
                    'rate' => $rate,
                    'contract_type' => 'full_time',
                ]);

                $startDate = $endDate;
            }
        }
    }
}
