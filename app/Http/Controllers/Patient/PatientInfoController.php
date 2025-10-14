<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\PatientRequest;
use App\Models\PatientInfo;
use Auth;
use Exception;
use Illuminate\Http\Request;
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

    /**
     * Search for patients based on query parameters.
     */
    public function search(Request $request)
    {
        $query = PatientInfo::select(['id', 'user_id', 'first_name', 'last_name', 'date_of_birth', 'phone_number']);

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');

            $query->where(fn($q) => $q->whereLike('first_name', "%$searchTerm%")
                ->orWhereLike('last_name', "%$searchTerm%")
                ->orWhereLike('date_of_birth', "%$searchTerm%")
                ->orWhereLike('phone_number', "%$searchTerm%"))
                ->orWhereHas('user', fn($q) => $q->whereLike('name', "%$searchTerm%")
                    ->orWhereLike('email', "%$searchTerm%"));
        } else {
            $query->where('id', 0);
        }

        $patients = $query->with('user:id,name,email,avatar')->cursorPaginate(10)->withQueryString();
        Log::info("Patient Info: Searched for patients", ['action_user_id' => Auth::id(), 'search_term' => $request->input('search')]);

        return Inertia::render('patient/Find', ['patients' => Inertia::scroll(fn() => $patients)]);
    }
}
