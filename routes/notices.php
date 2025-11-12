<?php

use App\Http\Controllers\Notice\NoticeController;

Route::middleware(['auth', 'verified'])->prefix('notices')->group(function () {
    Route::get('/', [NoticeController::class, 'index'])->name('notices.index')->middleware('permission:notice.index');
});
