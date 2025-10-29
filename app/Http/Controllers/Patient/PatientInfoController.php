<?php

namespace App\Http\Controllers\Patient;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\PatientRequest;
use App\Mail\AccountAssociationMail;
use App\Mail\NewAccountMail;
use App\Models\PatientInfo;
use App\Models\User;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use Mail;
use Str;

class PatientInfoController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function createPartial()
    {
        Log::info('Patient Info: Viewed create partial form', ['action_user_id' => Auth::id()]);

        return Inertia::render('patient/CreatePartial');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storePartial(PatientRequest $request)
    {
        try {
            $data = $request->validated();

            $patient = PatientInfo::create($data);
            Log::info('Patient Info: Attendant created patient info', ['action_user_id' => Auth::id(), 'patient_info_id' => $patient->id]);

            return to_route('patient_info.show', ['patientInfo' => $patient])->with('success', 'Patient information created successfully.');
        } catch (Exception $e) {
            Log::error('Patient Info: Failed to create patient info', [
                'action_user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to create patient information. Please try again.');
        }
    }

    /**
     * Search for patients based on query parameters.
     */
    public function search(Request $request)
    {
        if (Auth::user()->hasRole('Patient')) {
            return to_route('dashboard')->with('error', 'You do not have permission to edit this patient information.');
        }

        $query = PatientInfo::select(['id', 'user_id', 'first_name', 'last_name', 'date_of_birth', 'phone_number']);

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');

            $query->whereFullText(
                ['first_name', 'last_name', 'phone_number', 'address', 'insurance_company', 'emergency_contact_name'],
                $searchTerm
            )
                ->orWhereHas('user', fn ($q) => $q->whereLike('name', "%$searchTerm%")
                    ->orWhereLike('email', "%$searchTerm%"));
        } else {
            $query->where('id', 0);
        }

        $patients = $query->with('user:id,name,email,avatar')->cursorPaginate(10)->withQueryString();
        Log::info('Patient Info: Searched for patients', ['action_user_id' => Auth::id(), 'search_term' => $request->input('search')]);

        return Inertia::render('patient/Find', ['patients' => Inertia::scroll(fn () => $patients)]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PatientInfo $patientInfo)
    {
        if (Auth::user()->hasRole('Patient') && Auth::id() !== $patientInfo->user_id) {
            return to_route('dashboard')->with('error', 'You do not have permission to view this patient information.');
        }

        $patientInfo->load(['user:id,name,email,avatar,bio,created_at,updated_at,patient_info_id', 'medicalRecord'])->getAppends();
        Log::info('Patient Info: Viewed patient info', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfo->id]);

        return Inertia::render('patient/Show', ['patient' => $patientInfo]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PatientInfo $patientInfo)
    {
        Log::info('Patient Info: Viewed edit form for patient', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfo->id]);

        return Inertia::render('patient/Edit', ['patient' => $patientInfo]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PatientRequest $request, PatientInfo $patientInfo)
    {
        try {
            $data = $request->validated();

            $patientInfo->update($data);
            Log::info('Patient Info: Updated patient info', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfo->id]);

            return to_route('patient_info.show', ['patientInfo' => $patientInfo])->with('success', 'Patient information updated successfully.');
        } catch (Exception $e) {
            Log::error('Patient Info: Failed to update patient info', [
                'action_user_id' => Auth::id(),
                'patient_info_id' => $patientInfo->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to update patient information. Please try again.');
        }
    }

    /**
     * Show the form for creating a new account for the patient.
     */
    public function newAccount(PatientInfo $patientInfo)
    {
        if ($patientInfo->user_id) {
            return to_route('patient_info.show', ['patientInfo' => $patientInfo])->with('error', 'This patient already has an associated user account.');
        }

        Log::info('Patient Info: Viewed new account form for patient', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfo->id]);

        return Inertia::render('patient/NewAccount', ['patient' => $patientInfo]);
    }

    /**
     * Store a newly created user account for the patient.
     */
    public function storeNewAccount(Request $request, PatientInfo $patientInfo)
    {
        if ($patientInfo->user_id) {
            return to_route('patient_info.show', ['patientInfo' => $patientInfo])->with('error', 'This patient already has an associated user account.');
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|string|email|max:255|unique:users,email',
        ]);

        $genPassword = Str::random(12);

        $request->merge(['password' => $genPassword]);

        try {
            $user = User::create($request->only('name', 'email', 'password'))->assignRole('patient');

            $patientInfo->user()->associate($user);
            $patientInfo->save();

            Log::info('Patient Info: Created new account for patient', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfo->id, 'user_id' => $user->id]);

            Mail::to($user->email)->send(new NewAccountMail($user, $genPassword));

            return to_route('patient_info.show', ['patientInfo' => $patientInfo])->with('success', 'User account created successfully.');
        } catch (Exception $e) {
            Log::error('Patient Info: Failed to create user account for patient', [
                'action_user_id' => Auth::id(),
                'patient_info_id' => $patientInfo->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to create user account. Please try again.');
        }
    }

    /**
     * Associate an existing user account with the patient.
     */
    public function associateAccount(Request $request, PatientInfo $patientInfo)
    {
        if ($patientInfo->user_id) {
            return to_route('patient_info.show', ['patientInfo' => $patientInfo])->with('error', 'This patient already has an associated user account.');
        }

        $request->validate([
            'email' => 'required|exists:users,email|unique:users,patient_info_id',
        ]);

        try {
            $user = User::where('email', $request->input('email'))->firstOrFail();

            $patientInfo->user()->associate($user);
            $patientInfo->save();

            Mail::to($user->email)->send(new AccountAssociationMail($user, $patientInfo));

            Log::info('Patient Info: Associated existing account with patient', ['action_user_id' => Auth::id(), 'patient_info_id' => $patientInfo->id, 'user_id' => $user->id]);

            return to_route('patient_info.show', ['patientInfo' => $patientInfo])->with('success', 'User account associated successfully.');
        } catch (Exception $e) {
            Log::error('Patient Info: Failed to associate user account with patient', [
                'action_user_id' => Auth::id(),
                'patient_info_id' => $patientInfo->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to associate user account. Please try again.');
        }
    }

    /**
     * Simple search for patients (for FETCH/AXIOS requests).
     */
    public function simpleSearch(Request $request)
    {
        $search = trim($request->query('q'));
        $medicalRecordIsNull = $request->get('medical_record_is_null', FILTER_VALIDATE_BOOLEAN);

        $booleanQuery = Helpers::buildBooleanQuery($search);

        $patients = PatientInfo::whereFullText(['first_name', 'last_name', 'phone_number', 'address', 'insurance_company', 'emergency_contact_name'], $booleanQuery, ['mode' => 'boolean'])
            ->when($medicalRecordIsNull, fn ($q) => $q->whereNull('medical_record_id'))
            ->orWhereHas('user', fn ($q) => $q->whereLike('name', "%$search%")
                ->orWhereLike('email', "%$search%"))
            ->select(['id', 'first_name', 'last_name'])
            ->orderBy('first_name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($patients);
    }
}
