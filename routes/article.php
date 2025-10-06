<?php

use App\Http\Controllers\Article\ArticleController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('articles')->group(function () {
        Route::get('/', [ArticleController::class, 'index'])->name('articles.index')->middleware('role:Super Admin|Manager');
        Route::get('/my', [ArticleController::class, 'myArticles'])->name('articles.my')->middleware('permission:index.article');

        Route::get('/create', [ArticleController::class, 'create'])->name('articles.create')->middleware('permission:create.article');
        Route::post('/', [ArticleController::class, 'store'])->name('articles.store')->middleware('permission:create.article');

        Route::get('/{article}', [ArticleController::class, 'show'])->name('articles.show')->middleware('permission:show.article');

        Route::get('/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit')->middleware('permission:edit.article');
        Route::patch('/{article}', [ArticleController::class, 'update'])->name('articles.update')->middleware('permission:edit.article');

        Route::delete('/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy')->middleware('permission:destroy.article');
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [ArticleController::class, 'indexCategories'])->name('categories.index')->middleware('permission:index.category');
        Route::get('/create', [ArticleController::class, 'createCategory'])->name('categories.create')->middleware('permission:create.category');
        Route::post('/', [ArticleController::class, 'storeCategory'])->name('categories.store')->middleware('permission:create.category');
        Route::get('/{category}', [ArticleController::class, 'showCategory'])->name('categories.show')->middleware('permission:show.category');
        Route::get('/{category}/edit', [ArticleController::class, 'editCategory'])->name('categories.edit')->middleware('permission:edit.category');
        Route::patch('/{category}', [ArticleController::class, 'updateCategory'])->name('categories.update')->middleware('permission:edit.category');
        Route::delete('/{category}', [ArticleController::class, 'destroyCategory'])->name('categories.destroy')->middleware('permission:destroy.category');
    });
});
