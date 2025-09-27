<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\MedicalRecordRequest;
use App\Models\MedicalRecord;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('Medical Records: Viewed medical records list', ['action_user_id' => Auth::id()]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'patient_info.first_name', 'patient_info.last_name', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = MedicalRecord::select(['medical_records.id', 'medical_records.patient_info_id', 'medical_records.created_at', 'medical_records.updated_at'])
            ->with(['patientInfo' => fn($q) => $q->select('id', 'first_name', 'last_name')]);

        if (str_starts_with($sortBy, 'patient_info.')) {
            $query->leftJoin('patient_info', 'patient_info.id', '=', 'medical_records.patient_info_id');
        }

        $query->when($request->filled('search'), fn($qr) => $qr->whereFullText('medical_notes', "%$search%")
            ->orWhereHas('patientInfo', fn($q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%")));

        $medicalRecords = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('medicalRecords/Index', ['medicalRecords' => $medicalRecords]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MedicalRecordRequest $request)
    {
        Log::info('Medical Records: Created new medical record', ['action_user_id' => Auth::id(), 'patient_info_id' => $request->patient_info_id]);
        MedicalRecord::create($request->validated());
        return redirect()->route('medicalRecords.index')->with('success', 'Medical record created successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Log::info('Medical Records: Viewed create medical record form', ['action_user_id' => Auth::id()]);
        return Inertia::render('medicalRecords/Create');
    }
}
