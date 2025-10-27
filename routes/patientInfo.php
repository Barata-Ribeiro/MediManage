<?php

use App\Http\Controllers\Patient\PatientInfoController;

Route::middleware(['auth', 'verified'])->prefix('patients')->group(function () {
    Route::get('/simple-search', [PatientInfoController::class, 'simpleSearch'])->name('patient_info.simpleSearch')
        ->middleware('role_or_permission:Doctor|patient_info.index');

    Route::get('/create-partial', [PatientInfoController::class, 'createPartial'])->name('patient_info.createPartial')
        ->middleware('permission:patient_info.create');
    Route::post('/store-partial', [PatientInfoController::class, 'storePartial'])->name('patient_info.storePartial')
        ->middleware('permission:patient_info.create');
    Route::get('/search', [PatientInfoController::class, 'search'])->name('patient_info.search')
        ->middleware('permission:patient_info.index|patient_info.show');

    Route::get('/{patientInfo}', [PatientInfoController::class, 'show'])->name('patient_info.show')
        ->middleware('permission:patient_info.show');

    Route::get('{patientInfo}/new-account', [PatientInfoController::class, 'newAccount'])->name('patient_info.newAccount')
        ->middleware('permission:patient_info.create');
    Route::post('{patientInfo}/new-account', [PatientInfoController::class, 'storeNewAccount'])->name('patient_info.storeNewAccount')
        ->middleware('permission:patient_info.create');
    Route::post('/{patientInfo}/associate-account', [PatientInfoController::class, 'associateAccount'])->name('patient_info.associateAccount')
        ->middleware('permission:patient_info.create');

    Route::get('/{patientInfo}/edit', [PatientInfoController::class, 'edit'])->name('patient_info.edit')
        ->middleware('permission:patient_info.edit');
    Route::put('/{patientInfo}', [PatientInfoController::class, 'update'])->name('patient_info.update')
        ->middleware('permission:patient_info.edit');
});
