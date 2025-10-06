<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Database\Seeder;
use Log;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $action = [
            ['name' => 'index', 'label' => 'List %s'],
            ['name' => 'show', 'label' => 'View %s'],
            ['name' => 'create', 'label' => 'Create %s'],
            ['name' => 'edit', 'label' => 'Edit %s'],
            ['name' => 'destroy', 'label' => 'Delete %s'],
        ];

        $modules = [
            ['name' => 'user', 'label' => ['singular' => 'user', 'plural' => 'users']],
            ['name' => 'role', 'label' => ['singular' => 'role', 'plural' => 'roles']],
            ['name' => 'permission', 'label' => ['singular' => 'permission', 'plural' => 'permissions']],
            ['name' => 'patient_info', 'label' => ['singular' => 'patient', 'plural' => 'patients']],
            ['name' => 'employee_info', 'label' => ['singular' => 'employee', 'plural' => 'employees']],
            ['name' => 'appointment', 'label' => ['singular' => 'appointment', 'plural' => 'appointments']],
            ['name' => 'prescription', 'label' => ['singular' => 'prescription', 'plural' => 'prescriptions']],
            ['name' => 'medical_record', 'label' => ['singular' => 'medical record', 'plural' => 'medical records']],
            ['name' => 'medical_record_entries', 'label' => ['singular' => 'medical record entry', 'plural' => 'medical record entries']],
            ['name' => 'article', 'label' => ['singular' => 'article', 'plural' => 'articles']],
            ['name' => 'category', 'label' => ['singular' => 'category', 'plural' => 'categories']],
        ];

        $extraPermissions = [];

        try {
            $permissions = array_merge($extraPermissions);
            foreach ($modules as $mod) {
                foreach ($action as $ac) {
                    $label = sprintf($ac['label'], $mod['label']['singular']);

                    if ($ac['name'] === 'index') {
                        $label = sprintf($ac['label'], $mod['label']['plural']);
                    }

                    $permissions[] = [
                        'name' => $ac['name'] . '.' . $mod['name'],
                        'label' => $label,
                    ];
                }
            }

            foreach ($permissions as $perm) {
                Permission::where(['name' => $perm['name'], 'title' => $perm['label']])->existsOr(function () use ($perm) {
                    Permission::create(['name' => $perm['name'], 'title' => $perm['label']]);
                });
            }
        } catch (Exception $e) {
            Log::error('Error seeding permissions!', ['error' => $e->getMessage()]);
        }
    }
}
