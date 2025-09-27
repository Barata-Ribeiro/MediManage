<?php

use App\Http\Controllers\Prescription\DoctorPrescriptionController;

Route::middleware(['auth'])->prefix('prescriptions')->group(function () {
    Route::middleware(['role:Doctor'])->prefix('/{doctor}/doctor')->group(function () {
        Route::get('/', [DoctorPrescriptionController::class, 'index'])->name('prescriptions.index');
    });
});
