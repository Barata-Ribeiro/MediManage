<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\EmployeeInfo;
use App\Services\AppointmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    private AppointmentService $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    public function indexByDoctor(EmployeeInfo $doctor, Request $request)
    {
        $appointments = $this->appointmentService->getAppointmentsByDoctorWithRequest($doctor, $request);
        return Inertia::render('appointments/doctor/Index', [
            'appointments' => $appointments
        ]);
    }
}
