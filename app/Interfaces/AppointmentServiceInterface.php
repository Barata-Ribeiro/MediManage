<?php

namespace App\Interfaces;

use App\Models\EmployeeInfo;
use Illuminate\Http\Request;

interface AppointmentServiceInterface
{
    /**
     * Retrieve appointments for a specific doctor, applying filters from the HTTP request.
     *
     * This method returns the appointments associated with the given EmployeeInfo (doctor),
     * applying filtering options specified in the Request object.
     * Common request parameters are restricted to dates with time.
     *
     * @param  \App\Models\EmployeeInfo|\EmployeeInfo  $doctor  The doctor (employee) whose appointments are requested.
     * @param  \Illuminate\Http\Request|\Request  $request  HTTP request containing filter, sort and pagination parameters.
     * @return mixed The filtered list of appointments for the specified doctor.
     */
    public function getAppointmentsByDoctorWithRequest(EmployeeInfo $doctor, Request $request);

    /**
     * Create a new appointment from validated input.
     *
     * Accepts validated appointment data and persists a new appointment record.
     * The $validated argument is expected to contain all required fields (for example:
     * patient_info_id, employee_info_id, appointment_date, reason_for_visit), but implementations
     * should document the exact shape they expect and perform any necessary mapping.
     *
     * @param  mixed  $validated  Validated appointment data (array|object|DTO)
     * @return mixed The created appointment entity or a result indicating success/failure (e.g. model instance, array, bool)
     *
     * @throws \InvalidArgumentException If required fields are missing or invalid.
     * @throws \Throwable For storage or other internal errors that prevent creation.
     */
    public function createAppointment(mixed $validated);
}
