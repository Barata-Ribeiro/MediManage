<?php

namespace Database\Seeders;

use App\Models\Notice;
use App\Models\User;
use Illuminate\Database\Seeder;

class NoticeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $manager = User::role('Manager')->inRandomOrder()->first();

        $manager->notices()->createMany(Notice::factory()->count(4)->make()->toArray());
    }
}
