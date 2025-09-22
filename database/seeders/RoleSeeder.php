<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Database\Seeder;
use Log;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $allPermissions = Permission::pluck('name')->toArray();

            $roles = ['Super Admin' => ['all' => true]];

            foreach ($roles as $roleName => $permissions) {
                $role = Role::firstOrCreate(['name' => $roleName]);
                if (isset($permissions['all']) && $permissions['all']) {
                    $role->syncPermissions($allPermissions);
                } else {
                    $role->syncPermissions($permissions);
                }
            }
        } catch (Exception $e) {
            Log::error('Error seeding roles!', ['error' => $e->getMessage()]);
        }
    }
}
