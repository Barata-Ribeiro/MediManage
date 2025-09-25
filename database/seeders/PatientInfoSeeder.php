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
        $users = User::role('Patient')->get();

        PatientInfo::factory()->count(20)->create()->each(function ($info) use ($users) {
            $user = $users->random();
            $info->user_id = $user->id;
            $info->save();

            $user->patient_info_id = $info->id;
            $user->save();
        });
    }
}
