<?php

use App\Http\Controllers\Employee\EmployeeInfoController;

Route::middleware(['auth', 'verified'])->prefix('employees')->group(function () {
    Route::get('/doctor-simple-search', [EmployeeInfoController::class, 'doctorSimpleSearch'])->name('employee_info.doctorSimpleSearch')
        ->middleware('permission:employee_info.index');

    Route::get('/', [EmployeeInfoController::class, 'index'])->name('employee_info.index')->middleware('permission:employee_info.index');
});
