<?php

use App\Http\Controllers\Notice\NoticeController;

Route::middleware(['auth', 'verified'])->prefix('notices')->group(function () {
    Route::get('/', [NoticeController::class, 'index'])->name('notices.index')->middleware('permission:notice.index');

    Route::get('/create', [NoticeController::class, 'create'])->name('notices.create')->middleware('permission:notice.create');
    Route::post('/store', [NoticeController::class, 'store'])->name('notices.store')->middleware('permission:notice.create');

    Route::get('/{notice}/edit', [NoticeController::class, 'edit'])->name('notices.edit')->middleware('permission:notice.edit');
    Route::patch('/{notice}/update', [NoticeController::class, 'update'])->name('notices.update')->middleware('permission:notice.edit');
});
