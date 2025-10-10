<?php

namespace App\Http\Controllers\Medical\Prescription;

use App\Http\Controllers\Controller;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;
use App\Models\Prescription;
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
        if (Auth::user()->id !== $doctor->user_id) {
            return to_route('prescriptions.index', Auth::user()->employeeInfo->id);
        }

        Log::info('Doctor Prescription: Viewed issued prescriptions', ['action_user_id' => Auth::id()]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'patient_info.first_name', 'patient_info.last_name', 'date_issued', 'date_expires', 'is_valid', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = $doctor->prescriptions()
            ->select([
                'prescriptions.id',
                'prescriptions.validation_code',
                'prescriptions.is_valid',
                'prescriptions.employee_info_id',
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

        $prescriptions->getCollection()->transform(fn($p) => $p->makeHidden('qr_code'));

        return Inertia::render('doctor/prescriptions/Index', ['prescriptions' => $prescriptions]);
    }

    public function show(EmployeeInfo $doctor, PatientInfo $patientInfo, Prescription $prescription)
    {
        $doctor_id = Auth::user()->employeeInfo->id;

        if (($doctor->id !== $doctor_id) || ($prescription->employee_info_id !== $doctor->id || $prescription->patient_info_id !== $patientInfo->id)) {
            return to_route('prescriptions.index', $doctor_id);
        }

        Log::info('Doctor Prescription: Viewed prescription details', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id]);

        $prescription->load([
            'employeeInfo:id,first_name,last_name,gender,date_of_birth,license_number,license_expiry_date,specialization,phone_number',
            'patientInfo:id,first_name,last_name,gender,date_of_birth,phone_number'
        ])
            ->makeHidden(['employee_info_id', 'patient_info_id'])
            ->getAppends();

        return Inertia::render('doctor/prescriptions/Show', ['prescription' => $prescription]);
    }
}
