<?php

namespace App\Http\Controllers\General;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\AppointmentRequest;
use App\Models\Appointment;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;
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
     * Display a listing of the resource for a specific patient.
     */
    public function indexByPatient(PatientInfo $patient, Request $request)
    {
        if (Auth::user()->hasRole('Patient') && Auth::user()->patient_info_id !== $patient->id) {
            return to_route('dashboard')->with('error', 'You do not have permission to view these appointments.');
        }

        $perPage = (int) $request->query('per_page', 10);
        $search = trim($request->query('search'));
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = ['id', 'employee_info.first_name', 'employee_info.specialization', 'status', 'appointment_date', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $booleanQuery = Helpers::buildBooleanQuery($search);

        $appointmentsQuery = $patient->appointments()
            ->with([
                'employeeInfo' => fn ($q) => $q->select('id', 'user_id', 'first_name', 'last_name', 'specialization'),
                'employeeInfo.user' => fn ($q) => $q->select('id', 'name', 'email'),
            ])
            ->when($request->filled('search'), function ($qr) use ($search, $booleanQuery) {
                return $qr->where(function ($q) use ($search, $booleanQuery) {
                    $q->whereLike('status', "%$search%")
                        ->orWhereLike('reason_for_visit', "%$search%")
                        ->orWhereHas('employeeInfo', function ($q2) use ($search, $booleanQuery) {
                            $q2->whereFullText(['first_name', 'last_name', 'phone_number', 'address', 'specialization', 'position'], $booleanQuery, ['mode' => 'boolean'])
                                ->orWhereHas('user', fn ($q3) => $q3->whereLike('name', "%$search%")->orWhereLike('email', "%$search%"));
                        });
                });
            });

        $appointments = $appointmentsQuery->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('appointments/patient/Index', [
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
        $validated = $request->validated();

        try {
            $this->appointmentService->createAppointment($validated);

            Log::info('Appointment created successfully', ['action_user_id' => Auth::id(), 'patient_info_id' => $validated['patient_info_id'], 'employee_info_id' => $validated['employee_info_id'], 'appointment_date' => $validated['appointment_date']]);

            return to_route('dashboard')->with('success', 'Appointment created successfully.');
        } catch (Exception $e) {
            Log::error('Failed to create appointment', ['action_user_id' => Auth::id(), 'error' => $e->getMessage()]);

            return back()->withInput()->with('error', $e->getMessage());
        }
    }
}
