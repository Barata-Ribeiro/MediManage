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
     * @param \App\Models\EmployeeInfo|\EmployeeInfo $doctor The doctor (employee) whose appointments are requested.
     * @param \Illuminate\Http\Request|\Request $request HTTP request containing filter, sort and pagination parameters.
     * @return mixed The filtered list of appointments for the specified doctor.
     */
    public function getAppointmentsByDoctorWithRequest(EmployeeInfo $doctor, Request $request);
}
