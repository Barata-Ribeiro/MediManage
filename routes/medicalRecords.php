<?php

use App\Http\Controllers\Medical\MedicalRecordController;

Route::middleware(['auth'])->prefix('medical-records')->group(function () {
    Route::get('/my-medical-record', [MedicalRecordController::class, 'myMedicalRecord'])->name('medicalRecords.myRecord')->middleware('role:Patient');

    Route::get('/', [MedicalRecordController::class, 'index'])->name('medicalRecords.index')->middleware('permission:medical_record.index');
    Route::get('/create', [MedicalRecordController::class, 'create'])->name('medicalRecords.create')->middleware('permission:medical_record.create');
    Route::post('/', [MedicalRecordController::class, 'store'])->name('medicalRecords.store')->middleware('permission:medical_record.create');
    Route::get('/{medicalRecord}', [MedicalRecordController::class, 'show'])->name('medicalRecords.show')->middleware('permission:medical_record.show');
    Route::get('/{medicalRecord}/edit', [MedicalRecordController::class, 'edit'])->name('medicalRecords.edit')->middleware('permission:medical_record.edit');
    Route::patch('/{medicalRecord}', [MedicalRecordController::class, 'update'])->name('medicalRecords.update')->middleware('permission:medical_record.edit');
    Route::delete('/{medicalRecord}', [MedicalRecordController::class, 'destroy'])->name('medicalRecords.destroy')->middleware('permission:medical_record.destroy');

    Route::get('/{medicalRecord}/pdf', [MedicalRecordController::class, 'generateMedicalRecordPdf'])->name('medicalRecords.generatePdf')->middleware('permission:medical_record.show');

    Route::prefix('/{medicalRecord}/entries')->group(function () {
        Route::get('/create', [MedicalRecordController::class, 'createEntry'])->name('medicalRecords.entries.create')->middleware('permission:medical_record.create');
        Route::post('/', [MedicalRecordController::class, 'storeEntry'])->name('medicalRecords.entries.store')->middleware('permission:medical_record.create');
        Route::get('/{medicalRecordEntry}/edit', [MedicalRecordController::class, 'editEntry'])->name('medicalRecords.entries.edit')->middleware('permission:medical_record.edit');
        Route::patch('/{medicalRecordEntry}/edit', [MedicalRecordController::class, 'updateEntry'])->name('medicalRecords.entries.update')->middleware('permission:medical_record.edit');
    });
});
