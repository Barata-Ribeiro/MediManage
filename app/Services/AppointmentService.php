<?php

namespace App\Services;

use App\Interfaces\AppointmentServiceInterface;
use App\Models\Appointment;
use App\Models\EmployeeInfo;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class AppointmentService implements AppointmentServiceInterface
{
    public function getAppointmentsByDoctorWithRequest(EmployeeInfo $doctor, Request $request)
    {
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $appointmentsQuery = $doctor->appointments()
            ->whereYear('appointment_date', $year)
            ->whereMonth('appointment_date', $month)
            ->orderBy('appointment_date')
            ->with([
                'patientInfo' => fn ($q) => $q->select('id', 'user_id', 'first_name', 'last_name', 'date_of_birth'),
                'patientInfo.user' => fn ($q) => $q->select('id', 'name', 'email'),
            ]);

        return $appointmentsQuery->get();
    }

    public function createAppointment(mixed $validated)
    {
        // Use application timezone to ensure consistent parsing/comparison and correct "now" message
        $tz = config('app.timezone') ?? date_default_timezone_get();
        $appointmentDate = Carbon::parse($validated['appointment_date'], $tz);

        // Define work day bounds for the appointment's date in the app timezone
        $startOfWorkDay = $appointmentDate->copy()->setTime(8, 0);
        $endOfWorkDay = $appointmentDate->copy()->setTime(17, 0);

        $existsAppointmentForDoctorAtSameTime = Appointment::whereEmployeeInfoId($validated['employee_info_id'])
            ->whereAppointmentDate($appointmentDate->toDateTimeString())
            ->exists();

        $existsAppointmentForPatientOnSameDay = Appointment::wherePatientInfoId($validated['patient_info_id'])
            ->whereBetween('appointment_date', [$startOfWorkDay->toDateTimeString(), $endOfWorkDay->toDateTimeString()])
            ->exists();

        if ($existsAppointmentForDoctorAtSameTime) {
            throw new Exception('The selected doctor already has an appointment at this time. Please choose a different time.');
        }

        if ($existsAppointmentForPatientOnSameDay) {
            throw new Exception('The selected patient already has an appointment on this day. Please choose a different day.');
        }

        Appointment::create($validated);
    }
}
