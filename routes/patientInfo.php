<?php

use App\Http\Controllers\Patient\PatientInfoController;

Route::middleware(['auth', 'verified'])->prefix('patients')->group(function () {
    Route::get('/create-partial', [PatientInfoController::class, 'createPartial'])->name('patient_info.createPartial')
        ->middleware('permission:patient_info.create');
    Route::post('/store-partial', [PatientInfoController::class, 'storePartial'])->name('patient_info.storePartial')
        ->middleware('permission:patient_info.create');
    Route::get('/search', [PatientInfoController::class, 'search'])->name('patient_info.search')
        ->middleware('permission:patient_info.index|patient_info.show');

    Route::get('/{patientInfo}', [PatientInfoController::class, 'show'])->name('patient_info.show')
        ->middleware('permission:patient_info.show');
});
