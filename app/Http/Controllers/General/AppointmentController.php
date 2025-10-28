<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\AppointmentRequest;
use App\Models\Appointment;
use App\Models\EmployeeInfo;
use App\Services\AppointmentService;
use Auth;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class AppointmentController extends Controller
{
    private AppointmentService $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    /**
     * Display a listing of the resource for a specific doctor.
     */
    public function indexByDoctor(EmployeeInfo $doctor, Request $request)
    {
        $appointments = $this->appointmentService->getAppointmentsByDoctorWithRequest($doctor, $request);

        return Inertia::render('appointments/doctor/Index', [
            'appointments' => $appointments,
        ]);
    }

    /**
     * Update the status of the specified appointment.
     */
    public function updateStatus(Request $request, Appointment $appointment)
    {
        if (Auth::user()->hasRole(['Patient', 'Manager'])) {
            return to_route('dashboard')->with('error', 'You do not have permission to perform this action.');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:scheduled,confirmed,checked_in,canceled,missed,completed',
        ]);

        try {
            Log::info('Updating appointment status', ['action_user_id' => Auth::id(), 'appointment_id' => $appointment->id, 'new_status' => $validated['status']]);

            $appointment->update(['status' => $validated['status']]);

            return to_route('dashboard')->with('success', 'Appointment status updated successfully.');
        } catch (Exception $e) {
            Log::error('Failed to update appointment status', ['action_user_id' => Auth::id(), 'appointment_id' => $appointment->id, 'error' => $e->getMessage()]);

            return to_route('dashboard')->with('error', 'Failed to update appointment status.');
        }
    }

    /**
     * Show the form for creating a new appointment.
     */
    public function create()
    {
        $today = Carbon::now();

        $occupiedSlots = Appointment::whereDate('appointment_date', '>=', $today)
            ->whereStatus('scheduled')
            ->orderBy('appointment_date', 'asc')
            ->pluck('appointment_date');

        return Inertia::render('appointments/Create', [
            'occupiedSlots' => Inertia::defer(fn () => $occupiedSlots),
        ]);
    }

    /**
     * Store a newly created appointment in storage.
     */
    public function store(AppointmentRequest $request)
    {
        dd($request->all());
    }
}
