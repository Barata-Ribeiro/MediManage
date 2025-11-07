<?php

use App\Http\Controllers\Employee\EmployeeInfoController;

Route::middleware(['auth', 'verified'])->prefix('employees')->group(function () {
    Route::get('/doctor-simple-search', [EmployeeInfoController::class, 'doctorSimpleSearch'])->name('employee_info.doctorSimpleSearch')
        ->middleware('permission:employee_info.index');

    Route::get('/', [EmployeeInfoController::class, 'index'])->name('employee_info.index')->middleware('permission:employee_info.index');

    Route::get('/create', [EmployeeInfoController::class, 'create'])->name('employee_info.create')
        ->middleware('permission:employee_info.create');
    Route::post('/store', [EmployeeInfoController::class, 'store'])->name('employee_info.store')->middleware('permission:employee_info.create');

    Route::get('/{employeeInfo}', [EmployeeInfoController::class, 'show'])->name('employee_info.show')
        ->middleware('permission:employee_info.show');
});
