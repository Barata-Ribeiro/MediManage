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
        $appointmentDate = $validated['appointment_date'];
        $employeeInfoId = $validated['employee_info_id'];
        $patientInfoId = $validated['patient_info_id'];

        $appointmentCarbon = Carbon::parse($appointmentDate);
        $startOfWorkDay = $appointmentCarbon->copy()->setTime(8, 0);
        $endOfWorkDay = $appointmentCarbon->copy()->setTime(17, 0);

        $existsAppointmentForDoctorAtSameTime = Appointment::where('employee_info_id', $employeeInfoId)
            ->where('appointment_date', $appointmentDate)
            ->exists();

        $existsAppointmentForPatientOnSameDay = Appointment::where('patient_info_id', $patientInfoId)
            ->whereBetween('appointment_date', [$startOfWorkDay, $endOfWorkDay])
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
