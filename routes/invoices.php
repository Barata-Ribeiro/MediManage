<?php

use App\Http\Controllers\Invoice\InvoiceController;

Route::middleware(['auth', 'verified'])->prefix('invoices')->group(function () {
    Route::get('/my-invoices', [InvoiceController::class, 'myInvoices'])->name('invoices.myInvoices')->middleware('role:Patient');

    Route::get('/{invoice}/generate-pdf', [InvoiceController::class, 'generateInvoicePdf'])->name('invoices.generatePdf')->middleware('permission:invoice.show');
});
