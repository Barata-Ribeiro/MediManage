<?php

use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Article\CategoryController;

Route::middleware(['auth', 'verified'])->prefix('manage')->group(function () {
    Route::prefix('articles')->group(function () {
        Route::get('/', [ArticleController::class, 'index'])->name('articles.index')->middleware('role:Super Admin|Manager');
        Route::get('/my', [ArticleController::class, 'myIndex'])->name('articles.my')->middleware('permission:index.article');

        Route::get('/create', [ArticleController::class, 'create'])->name('articles.create')->middleware('permission:create.article');
        Route::post('/', [ArticleController::class, 'store'])->name('articles.store')->middleware('permission:create.article');

        Route::get('/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit')->middleware('permission:edit.article');
        Route::patch('/{article}', [ArticleController::class, 'update'])->name('articles.update')->middleware('permission:edit.article');

        Route::delete('/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy')->middleware('permission:destroy.article');
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index')->middleware('permission:index.category');
        Route::get('/create', [CategoryController::class, 'create'])->name('categories.create')->middleware('permission:create.category');
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:create.category');
        Route::get('/{category}', [CategoryController::class, 'show'])->name('categories.show')->middleware('permission:show.category');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:edit.category');
        Route::patch('/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:edit.category');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy')->middleware('permission:destroy.category');
    });
});
