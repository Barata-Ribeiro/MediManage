<?php

namespace Database\Seeders;

use App\Models\PatientInfo;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usersExist = User::count() > 0;

        PatientInfo::factory()->count(20)->create()->each(function ($info) use ($usersExist) {
            if ($usersExist && random_int(0, 1) === 1) {
                $user = User::inRandomOrder()->first();
                if ($user) {
                    $info->user()->associate($user);
                    $info->save();
                }
            }
        });
    }
}
