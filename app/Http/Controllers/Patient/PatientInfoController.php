<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Auth;
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
}
