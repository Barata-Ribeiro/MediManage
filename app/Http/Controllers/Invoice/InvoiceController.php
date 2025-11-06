<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use PDF;
use Str;

class InvoiceController extends Controller
{
    /**
     * Display a listing of all invoices.
     */
    public function index(Request $request)
    {
        Log::info('Invoice: Viewed all invoices', ['action_user_id' => Auth::id()]);

        $perPage = (int) $request->query('per_page', 10);
        $search = trim($request->query('search'));
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'consultation_date', 'patient_info.first_name', 'due_date', 'amount', 'payment_method', 'status'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $invoices = Invoice::select(['invoices.*'])
            ->with(['patientInfo' => fn ($q) => $q->select('id', 'first_name', 'last_name')]);

        if (str_starts_with($sortBy, 'patient_info.')) {
            $invoices->leftJoin('patient_info', 'patient_info.id', '=', 'invoices.patient_info_id');
        }

        $invoices = $invoices->when($request->filled('search'), fn ($q) => $q->whereLike('notes', "%$search%")
            ->orWhereLike('payment_method', "%$search%")->orWhereLike('status', "%$search%"))
            ->orWhereHas('patientInfo', fn ($q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%"))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('invoices/Index', ['invoices' => $invoices]);
    }

    /**
     * Display a listing of the patient's invoices.
     */
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

    /**
     * Generate PDF for a specific invoice.
     */
    public function generateInvoicePdf(Invoice $invoice)
    {
        try {
            Log::info('Generating PDF for Invoice ID: '.$invoice->id, ['action_user_id' => Auth::id()]);
            $hasPatientRole = Auth::user()->hasRole('Patient');
            $hasPatientInfo = is_null(Auth::user()->patient_info_id) === false;

            if ($hasPatientRole && $hasPatientInfo && Auth::user()->patient_info_id !== $invoice->patient_info_id) {
                Log::warning('Unauthorized PDF generation attempt for Invoice ID: '.$invoice->id, ['action_user_id' => Auth::id(), 'invoice_id' => $invoice->id]);

                return to_route('dashboard')->with('error', 'You are not authorized to generate this invoice PDF.');
            }

            $pdf = PDF::loadView('pdfs.invoice', ['invoice' => $invoice]);
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ])->setPaper('a4', 'portrait');

            $patientFullName = $invoice->patientInfo->full_name;
            $filename = 'invoice_'.$invoice->id.'_'.Str::slug($patientFullName);

            return $pdf->stream($filename.'.pdf');
        } catch (Exception $e) {
            Log::error('Error generating PDF for Invoice ID: '.$invoice->id.'.', ['action_user_id' => Auth::id(), 'invoice_id' => $invoice->id, 'error' => $e->getMessage()]);

            return to_route('dashboard')->with('error', 'Failed to generate invoice PDF. Please try again later.');
        }
    }
}
