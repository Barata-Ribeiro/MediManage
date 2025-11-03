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
            $guard = config('auth.defaults.guard', 'web');

            $allPermissions = Permission::where('guard_name', $guard)->pluck('name')->toArray();

            $modulesForRoles = $this->getModulesForRoles();

            $roles = [];
            foreach ($modulesForRoles as $roleName => $mods) {
                if ($roleName === 'Super Admin' && is_array($mods) && isset($mods['all']) && $mods['all']) {
                    $roles[$roleName] = ['all' => true];

                    continue;
                }

                $rolePermissions = [];
                foreach ($mods as $module => $actions) {
                    foreach ($actions as $action) {
                        $permissionName = $module.'.'.$action;
                        if (in_array($permissionName, $allPermissions)) {
                            $rolePermissions[] = $permissionName;
                        } else {
                            Log::warning("Permission '$permissionName' does not exist and cannot be assigned to role '$roleName'.");
                        }
                    }
                }

                $rolePermissions = array_values(array_intersect($rolePermissions, $allPermissions));

                $roles[$roleName] = $rolePermissions;
            }

            foreach ($roles as $roleName => $permissions) {
                $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => $guard]);
                if (is_array($permissions) && isset($permissions['all']) && $permissions['all']) {
                    $role->syncPermissions($allPermissions);
                } else {
                    $role->syncPermissions(array_values(array_intersect($permissions, $allPermissions)));
                }
            }
        } catch (Exception $e) {
            Log::error('Error seeding roles!', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Retrieves an array of modules associated with different roles.
     * This method is used internally by the seeder to define the permissions
     * or access levels for various roles in the system.
     *
     * @return array An associative array where keys are role names and values are arrays of module names.
     */
    private function getModulesForRoles(): array
    {
        return [
            'Super Admin' => ['all' => true],
            'Manager' => [
                'user' => ['index', 'show', 'create', 'edit'],
                'role' => ['index', 'show'],
                'permission' => ['index', 'show'],
                'patient_info' => ['index', 'show', 'edit', 'destroy'],
                'employee_info' => ['index', 'show', 'create', 'edit', 'destroy'],
                'appointment' => ['index', 'show', 'create', 'edit', 'destroy'],
                'prescription' => ['index', 'show', 'destroy'],
                'medical_record' => ['index', 'show', 'destroy'],
                'medical_record_entries' => ['index', 'show', 'destroy'],
                'article' => ['index', 'show', 'create', 'edit', 'destroy'],
                'category' => ['index', 'show', 'create', 'edit', 'destroy'],
                'contract' => ['index', 'show', 'create', 'edit', 'destroy'],
                'employee_payment' => ['index', 'show', 'create', 'edit', 'destroy'],
                'invoice' => ['index', 'show', 'create', 'edit', 'destroy'],
            ],
            'Doctor' => [
                'patient_info' => ['index', 'show', 'edit'],
                'employee_info' => ['index', 'show'],
                'appointment' => ['index', 'show'],
                'prescription' => ['index', 'show', 'create', 'edit'],
                'medical_record' => ['index', 'show', 'create', 'edit'],
                'medical_record_entries' => ['index', 'show', 'create', 'edit', 'destroy'],
                'article' => ['index', 'show', 'create', 'edit', 'destroy'],
                'category' => ['index', 'show', 'create'],
            ],
            'Attendant' => [
                'patient_info' => ['index', 'show', 'create', 'edit'],
                'employee_info' => ['index', 'show'],
                'appointment' => ['index', 'show', 'create', 'edit', 'destroy'],
                'prescription' => ['index', 'show'],
                'invoice' => ['index', 'show', 'create'],
            ],
            'Patient' => [
                'patient_info' => ['show'],
                'employee_info' => ['index', 'show'],
                'appointment' => ['index', 'show', 'create', 'edit', 'destroy'],
                'prescription' => ['index', 'show'],
                'medical_record' => ['show'],
                'medical_record_entries' => ['index', 'show'],
                'invoice' => ['index', 'show'],
            ],
            'Other Staff' => [],
            'Banned' => [],
        ];
    }
}
