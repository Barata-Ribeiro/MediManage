<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\MedicalRecordEntryRequest;
use App\Http\Requests\Medical\MedicalRecordRequest;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordEntry;
use App\Models\PatientInfo;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use Illuminate\Support\Facades\Schema;

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
    public function show(MedicalRecord $medicalRecord, Request $request)
    {
        Log::info('Medical Records: Viewed medical record', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

        $medicalRecord->load(['patientInfo' => fn($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender'])]);


        // Dynamically get columns except 'content_json'

        $columns = Schema::getColumnListing((new MedicalRecordEntry)->getTable());
        $columns = array_values(array_filter($columns, fn($c) => $c !== 'content_json'));

        $entries = MedicalRecordEntry::select($columns)
            ->where('medical_record_id', $medicalRecord->id)
            ->when($request->filled('search'), fn($q) => $q->where(function ($q2) use ($request) {
                $q2->whereFullText(['title', 'content_html'], $request->search)
                    ->orWhereLike('entry_type', "%$request->search%");
            }))
            ->orderBy('created_at', 'desc')
            ->cursorPaginate(10)
            ->withQueryString();

        return Inertia::render('medicalRecords/Show', ['medicalRecord' => $medicalRecord, 'entries' => Inertia::scroll(fn() => $entries)]);
    }

    /**
     * Generate PDF of the specified resource.
     */
    public function generateMedicalRecordPdf(MedicalRecord $medicalRecord)
    {
        try {

            $data = MedicalRecord::with('patientInfo')
                ->find($medicalRecord->id, ['id', 'patient_info_id', 'medical_notes_html', 'created_at', 'updated_at']);

            $entries = MedicalRecordEntry::where('medical_record_id', $medicalRecord->id)
                ->select(['id', 'medical_record_id', 'entry_type', 'title', 'content_html', 'created_at', 'updated_at'])
                ->latest('created_at')
                ->limit(5)
                ->get();

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

    /**
     * Show the form for creating a new resource entry.
     */
    public function createEntry(MedicalRecord $medicalRecord)
    {
        Log::info('Medical Records: Viewed create medical record entry form', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

        return Inertia::render('medicalRecords/entries/Create', [
            'medicalRecord' => $medicalRecord->load([
                'patientInfo' => fn($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender'])
            ])->only(['id', 'patient_info_id']) + [
                'patient_info' => $medicalRecord->patientInfo
                    ->append(['age', 'full_name'])
                    ->only(['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'age', 'full_name']),
            ],

            'appointments' => $medicalRecord->patientInfo->appointments()->whereNotIn('status', ['missed', 'canceled', 'scheduled'])
                ->orderBy('appointment_date', 'desc')->limit(10)->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource entry.
     */
    public function editEntry(MedicalRecord $medicalRecord, MedicalRecordEntry $medicalRecordEntry)
    {
        Log::info('Medical Records: Viewed edit medical record entry form', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'medical_record_entry_id' => $medicalRecordEntry->id]);

        return Inertia::render('medicalRecords/entries/Edit', [
            'medicalRecord' => $medicalRecord->load([
                'patientInfo' => fn($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender'])
            ])->only(['id', 'patient_info_id']) + [
                'patient_info' => $medicalRecord->patientInfo
                    ->append(['age', 'full_name'])
                    ->only(['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'age', 'full_name']),
            ],
            'medicalRecordEntry' => $medicalRecordEntry->load('appointment', 'employeeInfo:id,first_name,last_name,date_of_birth,gender'),
        ]);
    }


    /**
     * Update the specified resource entry in storage.
     */
    public function updateEntry(MedicalRecordEntryRequest $request, MedicalRecord $medicalRecord, MedicalRecordEntry $medicalRecordEntry)
    {
        try {
            Log::info('Medical Records: Updated medical record entry', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'medical_record_entry_id' => $medicalRecordEntry->id]);
            $medicalRecordEntry->update($request->validated());
            return to_route('medicalRecords.show', ['medicalRecord' => $medicalRecord])->with('success', 'Medical record entry updated successfully.');
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to update medical record entry', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'medical_record_entry_id' => $medicalRecordEntry->id, 'error' => $e->getMessage()]);
            return back()->withInput()->with('error', 'Failed to update medical record entry. Please try again.');
        }
    }
}
