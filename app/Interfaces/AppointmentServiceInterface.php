<?php

namespace App\Interfaces;

use App\Models\EmployeeInfo;
use Illuminate\Http\Request;

interface AppointmentServiceInterface
{
    /**
     * Retrieve a doctor's appointments filtered by month and year from the given request.
     *
     * Reads the 'month' and 'year' query parameters from the Request and falls back to the current
     * month/year via Carbon::now() when not provided. Filters appointments by the appointment_date's
     * year and month, orders results by appointment_date (ascending), and eager-loads limited columns
     * for related patient information:
     *  - patientInfo: id, user_id, first_name, last_name, date_of_birth
     *  - patientInfo.user: id, name, email
     *
     * @param  EmployeeInfo  $doctor  The doctor (EmployeeInfo) whose appointments will be queried.
     * @param  Request  $request  HTTP request containing optional 'month' and 'year' query parameters (integers).
     * @return \Illuminate\Database\Eloquent\Collection Collection of Appointment models matching the filters.
     */
    public function getAppointmentsByDoctorWithRequest(EmployeeInfo $doctor, Request $request);

    /**
     * Create a new appointment after performing concurrency and business-rule checks.
     *
     * This method expects a validated payload (typically an associative array) containing at least:
     * - 'appointment_date' (expected to be a DateTime/Carbon instance) — the desired appointment date/time.
     * - 'employee_info_id' — the id of the doctor/employee to schedule.
     * - 'patient_info_id' — the id of the patient.
     *
     * Behavior:
     * - Considers a working day window from 08:00 to 17:00 for the given appointment date when checking
     *   whether the patient already has an appointment on the same day.
     * - Performs two concurrent existence checks:
     *   1) Whether the specified doctor already has an appointment at the exact requested date/time.
     *   2) Whether the specified patient already has any appointment within the same day (08:00–17:00).
     * - If either check fails, an Exception is thrown with a user-facing message describing the conflict.
     * - If checks pass, a new Appointment record is created using Appointment::create($validated).
     *
     * Note: The method has side effects (persists a new Appointment) and does not return a value.
     *
     * @param  mixed  $validated  Validated input containing appointment data (see description above).
     * @return void
     *
     * @throws \Exception If the chosen doctor is already booked at the requested time, or if the patient
     *                    already has an appointment on that day.
     */
    public function createAppointment(mixed $validated);
}
