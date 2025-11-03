<?php

namespace Database\Seeders;

use App\Models\EmployeeInfo;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EmployeePaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (EmployeeInfo::all() as $employee) {
            $contract = $employee->contracts()->first();

            if ($contract) {
                $startDate = Carbon::parse($contract->start_date);
                $endDate = Carbon::parse($contract->end_date)->min(now());

                if ($contract->rate_type === 'monthly') {
                    $current = $startDate->copy()->endOfMonth();
                    while ($current->lte($endDate)) {
                        $employee->payments()->create([
                            'payment_date' => $current->toDateString(),
                            'amount' => $contract->rate,
                            'payment_method' => 'bank_transfer',
                            'transaction_reference' => fake()->uuid(),
                        ]);
                        $current->addMonth()->endOfMonth();
                    }
                } elseif ($contract->rate_type === 'daily') {
                    $current = $startDate->copy();
                    while ($current->lte($endDate)) {
                        $employee->payments()->create([
                            'payment_date' => $current->toDateString(),
                            'amount' => $contract->rate,
                            'payment_method' => 'bank_transfer',
                            'transaction_reference' => fake()->uuid(),
                        ]);
                        $current->addDay();
                    }
                }
            }
        }
    }
}
