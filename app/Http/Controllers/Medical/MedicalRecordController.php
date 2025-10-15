<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\MedicalRecordRequest;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordEntries;
use App\Models\PatientInfo;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
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

        $query->when($request->filled('search'), fn($qr) => $qr->whereFullText('medical_notes_html', "%$search%")
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
        try {
            Log::info('Medical Records: Created new medical record', ['action_user_id' => Auth::id(), 'patient_info_id' => $request->patient_info_id]);
            MedicalRecord::create($request->validated());
            return to_route('medicalRecords.index')->with('success', 'Medical record created successfully.');
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to create medical record', ['action_user_id' => Auth::id(), 'error' => $e->getMessage()]);
            return back()->withInput()->withErrors('Failed to create medical record. Please try again.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Log::info('Medical Records: Viewed create medical record form', ['action_user_id' => Auth::id()]);
        return Inertia::render('medicalRecords/Create');
    }

    /**
     * Display the specified resource.
     */
    public function show(MedicalRecord $medicalRecord)
    {
        Log::info('Medical Records: Viewed medical record', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

        $medicalRecord->load(['patientInfo' => fn($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender'])]);

        $entries = MedicalRecordEntries::whereMedicalRecordId($medicalRecord->id)
            ->orderBy('created_at', 'desc')->get();

        return Inertia::render('medicalRecords/Show', ['medicalRecord' => $medicalRecord, 'entries' => Inertia::defer(fn() => $entries)]);
    }

    /**
     * Generate PDF of the specified resource.
     */
    public function generateMedicalRecordPdf(MedicalRecord $medicalRecord)
    {
        try {

            $data = MedicalRecord::with('patientInfo')
                ->find($medicalRecord->id, ['id', 'patient_info_id', 'medical_notes_html', 'created_at', 'updated_at']);

            $entries = MedicalRecordEntries::where('medical_record_id', $medicalRecord->id)
                ->orderBy('created_at', 'desc')->get();

            $pdf = PDF::loadView('pdfs.medical-record', ['medicalRecord' => $data, 'entries' => $entries]);
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ])->setPaper('a4', 'portrait');

            $filename = 'medical_record_' . ($data->id ?? $medicalRecord->id);
            return $pdf->stream($filename . '.pdf');
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to generate medical record PDF', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'error' => $e->getMessage()]);
            return to_route('medicalRecords.index')->with('error', 'Failed to generate PDF. Please try again.');
        }
    }

    /**
     * Simple search for patients (for FETCH/AXIOS requests).
     */
    public function patientSimpleSearch(Request $request)
    {
        $search = $request->q;

        $patients = PatientInfo::select(['id', 'first_name', 'last_name'])
            ->where('medical_record_id', null)
            ->when($request->filled('q'), fn($q) => $q->whereLike('first_name', "%$search%")
                ->orWhereLike('last_name', "%$search%"))
            ->orderBy('first_name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($patients);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicalRecord $medicalRecord)
    {
        Log::info('Medical Records: Viewed edit medical record form', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

        $medicalRecord->load(['patientInfo' => fn($q) => $q->select(['id', 'first_name', 'last_name'])]);

        return Inertia::render('medicalRecords/Edit', ['medicalRecord' => $medicalRecord]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MedicalRecordRequest $request, MedicalRecord $medicalRecord)
    {
        try {
            Log::info('Medical Records: Updated medical record', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);
            $medicalRecord->update($request->validated());
            return to_route('medicalRecords.show', ['medicalRecord' => $medicalRecord])->with('success', 'Medical record updated successfully.');
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to update medical record', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'error' => $e->getMessage()]);
            return back()->withInput()->with('error', 'Failed to update medical record. Please try again.');
        }
    }
}
