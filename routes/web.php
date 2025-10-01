<?php

use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => 'guest'], function () {
    Route::get('/', [PublicController::class, 'home'])->name('home');
    Route::prefix('articles')->group(function () {
        Route::get('/', [PublicController::class, 'articles'])->name('articles');
        Route::get('/{article:slug}', [PublicController::class, 'article'])->name('article');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/prescription.php';
require __DIR__ . '/medicalRecords.php';
