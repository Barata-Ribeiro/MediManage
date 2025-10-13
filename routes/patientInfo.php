<?php

use App\Http\Controllers\Patient\PatientInfoController;

Route::middleware(['auth', 'verified'])->prefix('patient')->group(function () {
    Route::get('/create-partial', [PatientInfoController::class, 'createPartial'])->name('patient_info.createPartial')
        ->middleware('permission:patient_info.create');
});
