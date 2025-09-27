<?php

use App\Http\Controllers\MedicalRecordController;

Route::middleware(['auth'])->prefix('medical-records')->group(function () {
    Route::get('/', [MedicalRecordController::class, 'index'])->name('medicalRecords.index')->middleware('permission:index.medical_record');
    Route::get('/create', [MedicalRecordController::class, 'create'])->name('medicalRecords.create')->middleware('permission:create.medical_record');
    Route::post('/', [MedicalRecordController::class, 'store'])->name('medicalRecords.store')->middleware('permission:create.medical_record');
    Route::get('/{medicalRecord}', [MedicalRecordController::class, 'show'])->name('medicalRecords.show')->middleware('permission:show.medical_record');
    Route::get('/{medicalRecord}/edit', [MedicalRecordController::class, 'edit'])->name('medicalRecords.edit')->middleware('permission:edit.medical_record');
    Route::patch('/{medicalRecord}', [MedicalRecordController::class, 'update'])->name('medicalRecords.update')->middleware('permission:edit.medical_record');
    Route::delete('/{medicalRecord}', [MedicalRecordController::class, 'destroy'])->name('medicalRecords.destroy')->middleware('permission:destroy.medical_record');
});
