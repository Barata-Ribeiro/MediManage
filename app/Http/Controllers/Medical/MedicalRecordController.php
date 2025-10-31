<?php

namespace App\Http\Controllers\Medical;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\MedicalRecordEntryRequest;
use App\Http\Requests\Medical\MedicalRecordRequest;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordEntry;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Log;

class MedicalRecordController extends Controller
{
    /**
     * Display the authenticated patient's medical record.
     */
    public function myMedicalRecord(Request $request)
    {
        $patientInfoId = Auth::user()->patient_info_id;

        Log::info('Medical Records: Patient viewed their own medical record', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfoId]);

        $search = trim($request->query('search'));

        try {
            $medicalRecord = MedicalRecord::select(['id', 'patient_info_id', 'medical_notes_html', 'created_at', 'updated_at'])
                ->wherePatientInfoId($patientInfoId)->with('patientInfo:id,first_name,last_name,gender,date_of_birth')->firstOrFail();

            $columns = Schema::getColumnListing((new MedicalRecordEntry)->getTable());
            $columns = array_values(array_filter($columns, fn ($c) => $c !== 'content_json'));

            $booleanQuery = Helpers::buildBooleanQuery($search);

            $entries = MedicalRecordEntry::select($columns)
                ->whereMedicalRecordId($medicalRecord->id)
                ->when($request->filled('search'), fn ($q) => $q->where(function ($q2) use ($search, $booleanQuery) {
                    $q2->whereFullText(['title', 'content_html'], $booleanQuery, ['mode' => 'boolean'])
                        ->orWhereLike('entry_type', "%$search%");
                }))
                ->orderByDesc('created_at')
                ->cursorPaginate(10)
                ->withQueryString();

            return Inertia::render('medicalRecords/MyRecord', [
                'medicalRecord' => $medicalRecord,
                'entries' => Inertia::scroll(fn () => $entries),
            ]);
        } catch (ModelNotFoundException $e) {
            Log::warning('Medical Records: No medical record found for patient', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfoId]);
            $errorMessage = 'You have no medical record available yet. Consult with one of our medical professionals to create your record.';

            return to_route('dashboard')->with('error', $errorMessage);
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to retrieve patient medical record', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfoId, 'error' => $e->getMessage()]);

            return to_route('dashboard')->with('error', 'Failed to retrieve your medical record. Please contact support.');
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('Medical Records: Viewed medical records list', ['action_user_id' => Auth::id()]);

        $perPage = (int) $request->query('per_page', 10);
        $search = trim($request->query('search'));
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'patient_info.first_name', 'patient_info.last_name', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = MedicalRecord::select(['medical_records.id', 'medical_records.patient_info_id', 'medical_records.created_at', 'medical_records.updated_at'])
            ->with(['patientInfo' => fn ($q) => $q->select('id', 'first_name', 'last_name')]);

        if (str_starts_with($sortBy, 'patient_info.')) {
            $query->leftJoin('patient_info', 'patient_info.id', '=', 'medical_records.patient_info_id');
        }

        $booleanQuery = Helpers::buildBooleanQuery($search);

        $query->when($request->filled('search'), fn ($qr) => $qr->whereFullText('medical_notes_html', $booleanQuery, ['mode' => 'boolean'])
            ->orWhereHas('patientInfo', fn ($q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%")));

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
        $search = trim($request->query('search'));

        Log::info('Medical Records: Viewed medical record', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

        $medicalRecord->load(['patientInfo' => fn ($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender'])]);

        $columns = Schema::getColumnListing((new MedicalRecordEntry)->getTable());
        $columns = array_values(array_filter($columns, fn ($c) => $c !== 'content_json'));

        $booleanQuery = Helpers::buildBooleanQuery($search);

        $entries = MedicalRecordEntry::select($columns)
            ->whereMedicalRecordId($medicalRecord->id)
            ->when($request->filled('search'), fn ($q) => $q->where(function ($q2) use ($search, $booleanQuery) {
                $q2->whereFullText(['title', 'content_html'], $booleanQuery, ['mode' => 'boolean'])
                    ->orWhereLike('entry_type', "%$search%");
            }))
            ->orderByDesc('created_at')
            ->cursorPaginate(10)
            ->withQueryString();

        return Inertia::render('medicalRecords/Show', ['medicalRecord' => $medicalRecord, 'entries' => Inertia::scroll(fn () => $entries)]);
    }

    /**
     * Generate PDF of the specified resource.
     */
    public function generateMedicalRecordPdf(MedicalRecord $medicalRecord)
    {

        try {
            $hasPatientRole = Auth::user()->hasRole('Patient');
            $hasPatientInfo = is_null(Auth::user()->patient_info_id) === false;
            $hasMedicalRecord = $hasPatientInfo && MedicalRecord::where('patient_info_id', Auth::user()->patient_info_id)->exists();

            if ($hasPatientRole && $hasPatientInfo && Auth::user()->patient_info_id !== $medicalRecord->patient_info_id) {
                if ($hasMedicalRecord) {
                    $userMedicalRecordId = MedicalRecord::select('id')->wherePatientInfoId(Auth::user()->patient_info_id)->first();

                    return to_route('medicalRecords.generatePdf', ['medicalRecord' => $userMedicalRecordId]);
                }

                return to_route('dashboard')->with('error', 'You either do not have permission to access this medical record or it does not exist.');
            }

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

            $filename = 'medical_record_'.($data->id ?? $medicalRecord->id);

            Log::info('Medical Records: Generated medical record PDF', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

            return $pdf->stream($filename.'.pdf');
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to generate medical record PDF', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'error' => $e->getMessage()]);

            return to_route('medicalRecords.index')->with('error', 'Failed to generate PDF. Please try again.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicalRecord $medicalRecord)
    {
        Log::info('Medical Records: Viewed edit medical record form', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id]);

        $medicalRecord->load(['patientInfo' => fn ($q) => $q->select(['id', 'first_name', 'last_name'])]);

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
                'patientInfo' => fn ($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender']),
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
     * Store a newly created resource entry in storage.
     */
    public function storeEntry(MedicalRecordEntryRequest $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validated();
        $medicalRecordId = $medicalRecord->id;
        $doctorId = Auth::user()->employeeInfo->id;

        try {
            Log::info('Medical Records: Created new medical record entry', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecordId]);
            MedicalRecordEntry::create($validated + ['medical_record_id' => $medicalRecordId, 'employee_info_id' => $doctorId]);

            return to_route('medicalRecords.show', ['medicalRecord' => $medicalRecordId])->with('success', 'Medical record entry created successfully.');
        } catch (Exception $e) {
            Log::error('Medical Records: Failed to create medical record entry', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'error' => $e->getMessage()]);

            return back()->withInput()->with('error', 'Failed to create medical record entry. Please try again.');
        }
    }

    /**
     * Show the form for editing the specified resource entry.
     */
    public function editEntry(MedicalRecord $medicalRecord, MedicalRecordEntry $medicalRecordEntry)
    {
        Log::info('Medical Records: Viewed edit medical record entry form', ['action_user_id' => Auth::id(), 'medical_record_id' => $medicalRecord->id, 'medical_record_entry_id' => $medicalRecordEntry->id]);

        return Inertia::render('medicalRecords/entries/Edit', [
            'medicalRecord' => $medicalRecord->load([
                'patientInfo' => fn ($q) => $q->select(['id', 'first_name', 'last_name', 'date_of_birth', 'gender']),
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
