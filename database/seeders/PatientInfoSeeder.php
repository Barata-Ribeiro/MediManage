<?php

namespace Database\Seeders;

use App\Models\PatientInfo;
use App\Models\User;
use Carbon\Carbon;
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

            $info->update(['user_id' => $user->id]);
            $user->update(['patient_info_id' => $info->id]);

            $start = $user->created_at ?? now();
            $end = now();
            $createdAt = Carbon::createFromTimestamp(rand($start->timestamp, $end->timestamp));

            $updatedAt = (clone $createdAt)->addDays(rand(0, 30));
            if ($updatedAt->greaterThan($end)) {
                $updatedAt = $end;
            }

            $info->update(['created_at' => $createdAt, 'updated_at' => $updatedAt]);
        });
    }
}
