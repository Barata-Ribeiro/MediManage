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
        if (App::environment('local', 'testing', 'staging')) {
            $this->call([RoleSeeder::class, UserSeeder::class]);
        }
    }
}
