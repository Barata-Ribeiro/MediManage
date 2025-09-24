<?php

namespace Database\Seeders;

use App;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([RoleSeeder::class, AdminSeeder::class]);

        if (App::environment('local', 'testing', 'staging')) {
            $this->call([UserSeeder::class]);
        }
    }
}
