<?php

use App\Http\Controllers\General\DashboardController;
use App\Http\Controllers\General\PublicController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'guest'], function () {
    Route::get('/', [PublicController::class, 'home'])->name('home');
    Route::prefix('articles')->group(function () {
        Route::get('/', [PublicController::class, 'articles'])->name('articles');
        Route::get('/{article:slug}', [PublicController::class, 'article'])->name('article');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/prescription.php';
require __DIR__ . '/medicalRecords.php';
