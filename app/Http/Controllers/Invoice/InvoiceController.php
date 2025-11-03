<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class InvoiceController extends Controller
{
    public function myInvoices(Request $request)
    {
        Log::info('Patient Invoice: Viewed own invoices', ['action_user_id' => Auth::id()]);

        $patientInfo = Auth::user()->patientInfo;

        $perPage = (int) $request->query('per_page', 10);
        $search = trim($request->query('search'));
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'consultation_date', 'due_date', 'amount', 'payment_method', 'status'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $invoices = $patientInfo->invoices()
            ->when($request->filled('search'), fn ($q) => $q->where(function ($q) use ($search) {
                $q->whereLike('notes', "%$search%")
                    ->orWhereLike('payment_method', "%$search%")
                    ->orWhereLike('status', "%$search%");
            }))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('patient/invoices/MyInvoices', ['invoices' => $invoices]);
    }
}
