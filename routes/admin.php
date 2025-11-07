<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;

Route::middleware(['auth', 'role:Super Admin'])->prefix('admin')->group(function () {
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('admin.roles.index');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('admin.roles.edit');
        Route::patch('/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
        Route::patch('/{role}/toggle/{permission}', [RoleController::class, 'togglePermission'])->name('admin.roles.togglePermission');
    });

    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('admin.permissions.index');
        Route::get('/{permission}', [PermissionController::class, 'show'])->name('admin.permissions.show');
        Route::get('/{permission}/edit', [PermissionController::class, 'edit'])->name('admin.permissions.edit');
        Route::patch('/{permission}', [PermissionController::class, 'update'])->name('admin.permissions.update');
    });

    Route::prefix('users')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('admin.users.index');
        Route::get('/{user}', [UserManagementController::class, 'show'])->name('admin.users.show');
        Route::get('/{user}/edit', [UserManagementController::class, 'edit'])->name('admin.users.edit');
        Route::patch('/{user}', [UserManagementController::class, 'update'])->name('admin.users.update');
        Route::delete('/{user}', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');
    });

    Route::prefix('mailable')->group(function () {
        Route::get('/new-account', function () {
            $user = Auth::user();
            $password = Str::random(12);

            return new \App\Mail\NewAccountMail($user, $password);
        });

        Route::get('/account-association', function () {
            $user = Auth::user();
            $patientInfo = PatientInfo::factory()->makeOne()->first();

            return new \App\Mail\AccountAssociationMail($user, $patientInfo);
        });

        Route::get('/employee-registration', function () {
            $employee = EmployeeInfo::with('user')->inRandomOrder()->first();
            $password = Str::random(12);

            return new \App\Mail\EmployeeInfoMail($employee, $password);
        });
    });
});
