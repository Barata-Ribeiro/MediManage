<?php

use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Article\CategoryController;

Route::middleware(['auth', 'verified'])->prefix('manage')->group(function () {
    Route::prefix('articles')->group(function () {
        Route::get('/', [ArticleController::class, 'index'])->name('articles.index')->middleware('role:Super Admin|Manager');
        Route::get('/my', [ArticleController::class, 'myIndex'])->name('articles.my')->middleware('permission:article.index');

        Route::get('/create', [ArticleController::class, 'create'])->name('articles.create')->middleware('permission:article.create');
        Route::post('/', [ArticleController::class, 'store'])->name('articles.store')->middleware('permission:article.create');

        Route::get('/{article:slug}/edit', [ArticleController::class, 'edit'])->name('articles.edit')->middleware('permission:article.edit');
        Route::patch('/{article}', [ArticleController::class, 'update'])->name('articles.update')->middleware('permission:article.edit');

        Route::delete('/{article:slug}', [ArticleController::class, 'destroy'])->name('articles.destroy')->middleware
        ('permission:article.destroy');
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index')->middleware('permission:category.index');
        Route::get('/create', [CategoryController::class, 'create'])->name('categories.create')->middleware('permission:category.create');
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:category.create');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:category.edit');
        Route::patch('/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:category.edit');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy')->middleware('permission:category.destroy');
    });
});
