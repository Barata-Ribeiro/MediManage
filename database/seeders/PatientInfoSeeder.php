<?php

namespace Database\Seeders;

use App\Models\PatientInfo;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Seeder;
use Log;

class PatientInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $users = User::role('Patient')->inRandomOrder()->get();

            PatientInfo::factory()->count(80)->create()->each(function ($info) use ($users) {
                if ($users->isNotEmpty()) {
                    $user = $users->shift();

                    $info->update(['user_id' => $user->id]);
                    $user->update(['patient_info_id' => $info->id]);

                    $start = $user->created_at ?? now();
                } else {
                    $start = now();
                }

                $end = now();
                $createdAt = Carbon::createFromTimestamp(rand($start->timestamp, $end->timestamp));

                $updatedAt = (clone $createdAt)->addDays(rand(0, 30));
                if ($updatedAt->greaterThan($end)) {
                    $updatedAt = $end;
                }

                $info->update(['created_at' => $createdAt, 'updated_at' => $updatedAt]);
            });

            Log::info('Seeded patient info for users.');
        } catch (Exception $e) {
            Log::error('Error seeding patient info!', ['error' => $e]);
        }

    }
}
