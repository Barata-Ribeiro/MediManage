<?php

Route::middleware(['auth', 'role:Super Admin'])->group(function () {
    Route::get('/admin/test', function () {
        return response()->json(['status' => 'You are an admin.', 'timestamp' => now()->toDateTimeString()]);
    });
});
