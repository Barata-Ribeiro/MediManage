<?php

namespace App\Http\Controllers\Medical\Prescription;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class PrescriptionController extends Controller
{
    /**
     * Display a listing of the requesting user prescriptions.
     */
    public function index(Request $request)
    {
        Log::info('Patient Prescription: Viewed own prescriptions', ['action_user_id' => Auth::id()]);

        $user = Auth::user();

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'employee_info.first_name', 'employee_info.last_name', 'date_issued', 'date_expires', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = $user->patientInfo->prescriptions()
            ->select([
                'prescriptions.id',
                'prescriptions.validation_code',
                'prescriptions.is_valid',
                'prescriptions.employee_info_id',
                'prescriptions.date_issued',
                'prescriptions.date_expires',
                'prescriptions.updated_at',
            ])
            ->with(['doctorInfo' => fn($q) => $q->select('id', 'first_name', 'last_name')]);

        if (str_starts_with($sortBy, 'employee_info.')) {
            $query->leftJoin('employee_info', 'employee_info.id', '=', 'prescriptions.employee_info_id');
        }

        $query->when($request->filled('search'), fn($qr) => $qr->whereFullText('prescription_details', "%$search%")
            ->orWhereHas('doctorInfo', fn($q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%")));

        $prescriptions = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('patient/prescriptions/Index', ['prescriptions' => $prescriptions]);
    }
}
