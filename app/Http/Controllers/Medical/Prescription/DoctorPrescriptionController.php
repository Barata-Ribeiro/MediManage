<?php

namespace App\Http\Controllers\Medical\Prescription;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\PrescriptionRequest;
use App\Http\Requests\QueryRequest;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;
use App\Models\Prescription;
use Auth;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Log;

use function in_array;

class DoctorPrescriptionController extends Controller
{
    private bool $isSqlDriver;

    public function __construct()
    {
        $this->isSqlDriver = in_array(DB::getDriverName(), ['mysql', 'pgsql']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(EmployeeInfo $doctor, QueryRequest $request)
    {
        if (Auth::user()->id !== $doctor->user_id) {
            return to_route('prescriptions.index', Auth::user()->employeeInfo->id);
        }

        Log::info('Doctor Prescription: Viewed issued prescriptions', ['action_user_id' => Auth::id()]);

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'patient_info.first_name', 'patient_info.last_name', 'date_issued', 'date_expires', 'is_valid', 'updated_at'];
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

        $prescriptions = $doctor->prescriptions()
            ->select($select)
            ->with(['patientInfo' => fn ($q) => $q->select('id', 'first_name', 'last_name')])
            ->when(str_starts_with($sortBy, 'patient_info.'), fn (Builder $q) => $q->leftJoin('patient_info', 'patient_info.id', '=', 'prescriptions.patient_info_id'))
            ->when($search, function (Builder $qr) use ($search, $isSql) {
                if ($isSql) {
                    $booleanQuery = Helpers::buildBooleanQuery($search);
                    $qr->whereFullText('prescription_details_html', $booleanQuery, ['mode' => 'boolean'])
                        ->orWhereHas('patientInfo', fn (Builder $q) => $q->whereLike('first_name', "%$search%")->orWhereLike('last_name', "%$search%"));
                } else {
                    $qr->whereLike('prescription_details_html', "%$search%")
                        ->orWhereHas('patientInfo', fn (Builder $q) => $q->whenLike('first_name', "%$search%")->orWhenLike('last_name', "%$search%"));
                }
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        $prescriptions->getCollection()->transform(fn ($p) => $p->makeHidden('qr_code'));

        return Inertia::render('doctor/prescriptions/Index', ['prescriptions' => $prescriptions]);
    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeInfo $doctor, PatientInfo $patientInfo, Prescription $prescription)
    {
        $doctor_id = Auth::user()->employeeInfo->id;

        if (($doctor->id !== $doctor_id) || ($prescription->employee_info_id !== $doctor->id || $prescription->patient_info_id !== $patientInfo->id)) {
            return to_route('prescriptions.index', $doctor_id);
        }

        Log::info('Doctor Prescription: Viewed prescription details', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id]);

        $prescription->load([
            'employeeInfo:id,first_name,last_name,gender,date_of_birth,license_number,license_expiry_date,specialization,phone_number',
            'patientInfo:id,first_name,last_name,gender,date_of_birth,phone_number',
        ])
            ->makeHidden(['employee_info_id', 'patient_info_id'])
            ->getAppends();

        return Inertia::render('doctor/prescriptions/Show', ['prescription' => $prescription]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmployeeInfo $doctor, PatientInfo $patientInfo, Prescription $prescription)
    {
        $doctor_id = Auth::user()->employeeInfo->id;

        if (($doctor->id !== $doctor_id) || ($prescription->employee_info_id !== $doctor->id || $prescription->patient_info_id !== $patientInfo->id)) {
            return to_route('prescriptions.index', $doctor_id);
        }

        Log::info('Doctor Prescription: Viewed prescription edit form', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id]);

        $prescription->load(['employeeInfo:id,first_name,last_name', 'patientInfo:id,first_name,last_name,gender,date_of_birth'])
            ->makeHidden(['qr_code'])
            ->getAppends();

        return Inertia::render('doctor/prescriptions/Edit', ['prescription' => $prescription]);
    }

    public function update(EmployeeInfo $doctor, PatientInfo $patientInfo, Prescription $prescription, PrescriptionRequest $request)
    {
        try {
            $doctor_id = Auth::user()->employeeInfo->id;

            if (($doctor->id !== $doctor_id) || ($prescription->employee_info_id !== $doctor->id || $prescription->patient_info_id !== $patientInfo->id)) {
                return to_route('prescriptions.index', $doctor_id);
            }

            $validated = $request->validated();
            Log::debug('Doctor Prescription: Update prescription request data', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id, 'data' => $validated]);

            $prescription->update($validated);

            Log::info('Doctor Prescription: Updated prescription', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id]);

            return to_route('prescriptions.show', [$doctor->id, $patientInfo->id, $prescription->id])->with('success', 'Prescription updated successfully.');
        } catch (Exception $e) {
            Log::error('Doctor Prescription: Failed to update prescription', ['action_user_id' => Auth::id(), 'prescription_id' => $prescription->id, 'error' => $e->getMessage()]);

            return back()->withInput()->with('error', 'Failed to update prescription. Please try again.');
        }
    }
}
