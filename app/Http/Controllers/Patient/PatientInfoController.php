<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\PatientRequest;
use App\Models\PatientInfo;
use Auth;
use Exception;
use Inertia\Inertia;
use Log;

class PatientInfoController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function createPartial()
    {
        Log::info("Patient Info: Viewed create partial form", ['action_user_id' => Auth::id()]);
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
            Log::info("Patient Info: Attendant created patient info", ['action_user_id' => Auth::id(), 'patient_info_id' => $patient->id]);

            // TODO: Change route to patient listing or patient detail page
            return to_route('dashboard')->with('success', 'Patient information created successfully.');
        } catch (Exception $e) {
            Log::error('Patient Info: Failed to create patient info', [
                'action_user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->withInput()->with('error', 'Failed to create patient information. Please try again.');
        }
    }
}
