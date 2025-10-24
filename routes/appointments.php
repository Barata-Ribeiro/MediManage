<?php

use App\Http\Controllers\General\AppointmentController;

Route::middleware(['auth'])->prefix('appointments')->group(function () {
    Route::prefix('/{doctor}/doctor')->group(function () {
        Route::get('/', [AppointmentController::class, 'indexByDoctor'])->name('appointments.doctor.index')->middleware('role_or_permission:Doctor|appointment.index');
    });

    Route::prefix('/{patient}/patient')->group(function () {
        Route::get('/', [AppointmentController::class, 'indexByPatient'])->name('appointments.patient.index')->middleware('role_or_permission:Patient|appointment.index');
    });

    Route::patch('/{appointment}/status', [AppointmentController::class, 'updateStatus'])->name('appointments.update.status')->middleware('permission:appointment.edit');
});
