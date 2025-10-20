<?php

namespace App\Services;

use App\Interfaces\AppointmentServiceInterface;
use App\Models\EmployeeInfo;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AppointmentService implements AppointmentServiceInterface
{
    public function getAppointmentsByDoctorWithRequest(EmployeeInfo $doctor, Request $request)
    {
        $month = $request->query('month') ?? Carbon::now()->month;
        $year = $request->query('year') ?? Carbon::now()->year;

        $appointmentsQuery = $doctor->appointments();

        $appointmentsQuery->whereYear('appointment_date', $year)
            ->whereMonth('appointment_date', $month)
            ->orderBy('appointment_date', 'asc');

        $appointmentsQuery->with([
            'patientInfo' => fn($q) => $q->select('id', 'user_id', 'first_name', 'last_name', 'date_of_birth'),
            'patientInfo.user' => fn($q) => $q->select('id', 'name', 'email'),
        ]);

        return $appointmentsQuery->get();
    }
}
