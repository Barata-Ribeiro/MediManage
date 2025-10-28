<?php

use App\Http\Controllers\Employee\EmployeeInfoController;

Route::middleware(['auth', 'verified'])->prefix('employees')->group(function () {
    Route::get('/simple-search', [EmployeeInfoController::class, 'simpleSearch'])->name('employee_info.simpleSearch')
        ->middleware('permission:employee_info.index');
});
