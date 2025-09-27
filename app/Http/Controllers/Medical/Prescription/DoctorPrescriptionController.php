<?php

namespace App\Http\Controllers\Medical\Prescription;

use App\Http\Controllers\Controller;
use App\Models\EmployeeInfo;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class DoctorPrescriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(EmployeeInfo $doctor, Request $request)
    {
        Log::info('Doctor Prescription: Viewed issued prescriptions', ['action_user_id' => Auth::id()]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'patient_info.first_name', 'patient_info.last_name', 'date_issued', 'date_expires', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = $doctor->prescriptions()
            ->select([
                'prescriptions.id',
                'prescriptions.patient_info_id',
                'prescriptions.date_issued',
                'prescriptions.date_expires',
                'prescriptions.updated_at',
            ])
            ->with(['patientInfo' => fn($q) => $q->select('id', 'first_name', 'last_name')]);

        if (str_starts_with($sortBy, 'patient_info.')) {
            $query->leftJoin('patient_info', 'patient_info.id', '=', 'prescriptions.patient_info_id');
        }

        $query->when($request->filled('search'), fn($qr) => $qr->whereFullText('prescription_details', "%$search%")
            ->orWhereHas('patientInfo', fn($q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%")));

        $prescriptions = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('doctor/prescriptions/Index', ['prescriptions' => $prescriptions]);
    }
}
