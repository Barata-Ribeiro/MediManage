<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserManagementController;

Route::middleware(['auth', 'role:Super Admin'])->prefix('admin')->group(function () {
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('admin.roles.index');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('admin.roles.edit');
        Route::patch('/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
    });

    Route::prefix('users')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('admin.users.index');
        Route::get('/{user}', [UserManagementController::class, 'show'])->name('admin.users.show');
        Route::get('/{user}/edit', [UserManagementController::class, 'edit'])->name('admin.users.edit');
        Route::patch('/{user}', [UserManagementController::class, 'update'])->name('admin.users.update');
        Route::delete('/{user}', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');
    });
});
