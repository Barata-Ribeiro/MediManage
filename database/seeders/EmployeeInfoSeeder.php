<?php

namespace Database\Seeders;

use App\Models\EmployeeInfo;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EmployeeInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::role(['Doctor', 'Attendant', 'Manager', 'Other Staff'])->get();

        foreach ($users as $user) {
            $employee = EmployeeInfo::factory()
                ->forRole($user->getRoleNames()->first())
                ->create(['user_id' => $user->id]);

            $user->update(['employee_info_id' => $employee->id]);

            $start = $user->created_at ?? now();
            $end = now();
            $createdAt = Carbon::createFromTimestamp(rand($start->timestamp, $end->timestamp));

            $updatedAt = (clone $createdAt)->addDays(rand(0, 30));
            if ($updatedAt->greaterThan($end)) {
                $updatedAt = $end;
            }

            $employee->update(['created_at' => $createdAt, 'updated_at' => $updatedAt]);
        }
    }
}
