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
        $this->call([PermissionSeeder::class, RoleSeeder::class, AdminSeeder::class]);

        if (App::environment('local', 'testing', 'staging')) {
            $this->call([
                UserSeeder::class,
                PatientInfoSeeder::class,
                EmployeeInfoSeeder::class,
                PrescriptionSeeder::class,
                MedicalRecordSeeder::class,
                CategorySeeder::class,
                ArticleSeeder::class,
                NoticeSeeder::class
            ]);
        }
    }
}
