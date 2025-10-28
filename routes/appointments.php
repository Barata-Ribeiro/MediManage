<?php

use App\Http\Controllers\General\AppointmentController;

Route::middleware(['auth'])->prefix('appointments')->group(function () {
    Route::prefix('/{doctor}/doctor')->group(function () {
        Route::get('/', [AppointmentController::class, 'indexByDoctor'])->name('appointments.doctor.index')->middleware('role_or_permission:Doctor|appointment.index');
    });

    Route::prefix('/{patient}/patient')->group(function () {
        Route::get('/', [AppointmentController::class, 'indexByPatient'])->name('appointments.patient.index')->middleware('role_or_permission:Patient|appointment.index');
    });

    Route::patch('/{appointment}/status', [AppointmentController::class, 'updateStatus'])->name('appointments.update.status')->middleware('role_or_permission:Doctor|appointment.edit');

    Route::get('/schedule', [AppointmentController::class, 'create'])->name('appointments.create')->middleware('permission:appointment.create');
    Route::post('/', [AppointmentController::class, 'store'])->name('appointments.store')->middleware('permission:appointment.create');
});
