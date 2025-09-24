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

            // Build role -> permissions mapping programmatically to avoid listing every permission manually.
            $actions = ['index', 'show', 'create', 'edit', 'destroy'];

            $modulesForRoles = [
                'Super Admin' => ['all' => true],
                // Manager should be able to manage most resources
                'Manager' => ['user', 'role', 'permission', 'patient_info', 'employee_info', 'appointment', 'prescription', 'medical_record', 'medical_record_entries'],
                // Doctor primarily works with patients, records and prescriptions
                'Doctor' => ['patient_info', 'appointment', 'prescription', 'medical_record', 'medical_record_entries'],
                // Attendant handles appointments and basic patient records
                'Attendant' => ['patient_info', 'appointment', 'prescription'],
                // Patient can view/list their own info, appointments and prescriptions/records
                'Patient' => ['patient_info', 'appointment', 'prescription', 'medical_record'],
                // Other Staff have no special permissions by default
                'Other Staff' => [],
                // Banned: no permissions
                'Banned' => [],
            ];

            $roles = [];
            foreach ($modulesForRoles as $roleName => $mods) {
                if ($roleName === 'Super Admin' && is_array($mods) && isset($mods['all']) && $mods['all']) {
                    $roles[$roleName] = ['all' => true];
                    continue;
                }

                $perms = [];
                foreach ($mods as $mod) {
                    foreach ($actions as $act) {
                        $perms[] = $act . '.' . $mod;
                    }
                }

                $perms = array_values(array_intersect($perms, $allPermissions));

                $roles[$roleName] = $perms;
            }

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
