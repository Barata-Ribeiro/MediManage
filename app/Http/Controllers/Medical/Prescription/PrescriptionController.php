<?php

namespace App\Http\Controllers\Medical\Prescription;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Log;
use Str;

class PrescriptionController extends Controller
{
    private bool $isSqlDriver;

    public function __construct()
    {
        $this->isSqlDriver = in_array(DB::getDriverName(), ['mysql', 'pgsql']);
    }

    /**
     * Display a listing of the requesting user prescriptions.
     */
    public function myPrescriptions(Request $request)
    {
        Log::info('Patient Prescription: Viewed own prescriptions', ['action_user_id' => Auth::id()]);

        $user = Auth::user();

        $perPage = (int) $request->query('per_page', 10);
        $search = trim($request->query('search'));
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'employee_info.first_name', 'employee_info.specialization', 'date_issued', 'date_expires', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $select = [
            'prescriptions.id',
            'prescriptions.validation_code',
            'prescriptions.is_valid',
            'prescriptions.employee_info_id',
            'prescriptions.patient_info_id',
            'prescriptions.date_issued',
            'prescriptions.date_expires',
            'prescriptions.updated_at',
        ];

        $isSql = $this->isSqlDriver;

        $query = $user->patientInfo->prescriptions()
            ->select($select)
            ->with(['employeeInfo' => fn ($q) => $q->select('id', 'first_name', 'last_name', 'specialization')]);

        if (str_starts_with($sortBy, 'employee_info.')) {
            $query->leftJoin('employee_info', 'employee_info.id', '=', 'prescriptions.employee_info_id');
        }

        $query->when($request->filled('search'), function ($qr) use ($search, $isSql) {
            if ($isSql) {
                $booleanQuery = Helpers::buildBooleanQuery($search);
                $qr->whereFullText('prescription_details_html', $booleanQuery, ['mode' => 'boolean'])
                    ->orWhereHas('employeeInfo', fn ($q) => $q->whereFullText(['first_name', 'last_name', 'phone_number', 'address', 'specialization', 'position'], $booleanQuery, ['mode' => 'boolean'])
                        ->orWhereHas('user', fn ($q2) => $q2->whereLike('name', "%$search%")->orWhereLike('email', "%$search%")));
            } else {
                $qr->whereLike('prescription_details_html', "%$search%")
                    ->orWhereHas('employeeInfo', fn ($q) => $q->whenLike('first_name', "%$search%")
                        ->orWhenLike('last_name', "%$search%")->orWhenLike('phone_number', "%$search%")
                        ->orWhenLike('address', "%$search%")->orWhenLike('specialization', "%$search%")->orWhenLike('position', "%$search%")
                        ->orWhereHas('user', fn ($q2) => $q2->whereLike('name', "%$search%")->orWhereLike('email', "%$search%")));
            }
        });

        $prescriptions = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('patient/prescriptions/Index', ['prescriptions' => $prescriptions]);
    }

    /**
     * Generate a PDF for the specified prescription.
     */
    public function generatePdf(Prescription $prescription)
    {
        try {
            $requestingUser = Auth::user();

            if ($requestingUser->hasRole('Patient')) {
                if ($prescription->patient_info_id !== $requestingUser->patientInfo->id) {
                    Log::warning('Patient Prescription: Unauthorized PDF generation attempt', ['action_user_id' => $requestingUser->id, 'prescription_id' => $prescription->id]);
                    abort(403, 'You do not have permission to generate this prescription PDF.');
                }

                return $this->generatePrescriptionPdf($prescription);
            }

            return $this->generatePrescriptionPdf($prescription);
        } catch (Exception $e) {
            Log::error('Prescription: Failed to generate PDF', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id, 'error' => $e->getMessage()]);

            return to_route('prescriptions.index')->with('error', 'Failed to generate prescription PDF. Please try again.');
        }
    }

    /**
     * Generate and stream the prescription PDF.
     *
     * @return Response
     */
    private function generatePrescriptionPdf(Prescription $prescription)
    {
        $data = [
            'prescription' => $prescription,
            'patient' => $prescription->patientInfo->getAppends(),
            'doctor' => $prescription->employeeInfo->getAppends(),
        ];

        $pdf = PDF::loadView('pdfs.prescription', $data);
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ])->setPaper('a4', 'portrait');
        $fileName = 'prescription_'.Str::slug($prescription->patientInfo->full_name).'.pdf';

        return $pdf->stream($fileName.'.pdf');
    }
}
