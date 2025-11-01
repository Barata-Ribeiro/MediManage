<?php

use App\Http\Controllers\Medical\Prescription\DoctorPrescriptionController;
use App\Http\Controllers\Medical\Prescription\PrescriptionController;

Route::middleware(['auth'])->prefix('prescriptions')->group(function () {
    Route::get('/my-prescriptions', [PrescriptionController::class, 'myPrescriptions'])->name('prescriptions.myPrescriptions')->middleware('role:Patient');

    Route::middleware(['role:Doctor'])->prefix('/{doctor}/doctor')->group(function () {
        Route::get('/', [DoctorPrescriptionController::class, 'index'])->name('prescriptions.index');
        Route::get('/{patientInfo}/patient/{prescription}', [DoctorPrescriptionController::class, 'show'])->name('prescriptions.show');
        Route::get('/{patientInfo}/patient/{prescription}/edit', [DoctorPrescriptionController::class, 'edit'])->name('prescriptions.edit');
        Route::patch('/{patientInfo}/patient/{prescription}', [DoctorPrescriptionController::class, 'update'])->name('prescriptions.update');
    });

    Route::get('/{prescription}/generate-pdf', [PrescriptionController::class, 'generatePdf'])->name('prescriptions.generatePdf')->middleware('permission:prescription.show');
});
