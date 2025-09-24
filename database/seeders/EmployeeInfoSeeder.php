<?php

namespace Database\Seeders;

use App\Models\EmployeeInfo;
use App\Models\User;
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
            EmployeeInfo::factory()->forRole($user->getRoleNames()->first())->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
