<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Requests\QueryRequest;
use App\Models\Invoice;
use Auth;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Log;
use PDF;
use Str;

use function in_array;

class InvoiceController extends Controller
{
    /**
     * Display a listing of all invoices.
     */
    public function index(QueryRequest $request)
    {
        Log::info('Invoice: Viewed all invoices', ['action_user_id' => Auth::id()]);

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'consultation_date', 'patient_info.first_name', 'due_date', 'amount', 'payment_method', 'status'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $invoices = Invoice::query()
            ->select(['invoices.*'])
            ->with(['patientInfo' => fn (Builder $q) => $q->select('id', 'first_name', 'last_name')])
            ->when(str_starts_with($sortBy, 'patient_info.'), fn ($q) => $q->leftJoin('patient_info', 'patient_info.id', '=', 'invoices.patient_info_id'))
            ->when($search, fn (Builder $q) => $q->whereLike('notes', "%$search%")
                ->orWhereLike('payment_method', "%$search%")->orWhereLike('status', "%$search%"))
            ->orWhereHas('patientInfo', fn (Builder $q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%"))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('invoices/Index', ['invoices' => $invoices]);
    }

    /**
     * Display a listing of the patient's invoices.
     */
    public function myInvoices(QueryRequest $request)
    {
        Log::info('Patient Invoice: Viewed own invoices', ['action_user_id' => Auth::id()]);

        $patientInfo = Auth::user()->patientInfo;

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'consultation_date', 'due_date', 'amount', 'payment_method', 'status'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $invoices = $patientInfo->invoices()
            ->when($search, fn (Builder $q) => $q->where(function (Builder $q) use ($search) {
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
            Log::info("Generating PDF for Invoice ID: {$invoice->id}", ['action_user_id' => Auth::id()]);
            $hasPatientRole = Auth::user()->hasRole('Patient');
            $hasPatientInfo = Auth::user()->patient_info_id !== null;

            if ($hasPatientRole && $hasPatientInfo && Auth::user()->patient_info_id !== $invoice->patient_info_id) {
                Log::warning("Unauthorized PDF generation attempt for Invoice ID: {$invoice->id}", ['action_user_id' => Auth::id(), 'invoice_id' => $invoice->id]);

                return to_route('dashboard')->with('error', 'You are not authorized to generate this invoice PDF.');
            }

            $pdf = PDF::loadView('pdfs.invoice', ['invoice' => $invoice]);
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ])->setPaper('a4', 'portrait');

            $patientFullName = $invoice->patientInfo->full_name;
            $filename = "invoice_{$invoice->id}_".Str::slug($patientFullName);

            return $pdf->stream($filename.'.pdf');
        } catch (Exception $e) {
            Log::error("Error generating PDF for Invoice ID: {$invoice->id}.", ['action_user_id' => Auth::id(), 'invoice_id' => $invoice->id, 'error' => $e->getMessage()]);

            return to_route('dashboard')->with('error', 'Failed to generate invoice PDF. Please try again later.');
        }
    }
}
