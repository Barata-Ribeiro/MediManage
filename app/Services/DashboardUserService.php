<?php

namespace App\Services;

use App\Interfaces\DashboardUserServiceInterface;
use App\Models\Appointment;
use Auth;

class DashboardUserService implements DashboardUserServiceInterface
{
    /**
     * Get data for the user dashboard.
     *
     * @return array
     */
    public function getUserDashboardData(): array
    {
        $nextAppointments = $this->fetchUserNextAppointments(Auth::user()->patient_info_id);
        $profile = Auth::user()->load('patientInfo')->makeHidden(['permissions']);

        return [
            'data' => [
                'appointments' => $nextAppointments,
                'profile' => $profile,
            ]
        ];
    }

    private function fetchUserNextAppointments(int $patientInfoId)
    {
        if (!$patientInfoId) {
            return [];
        }

        return Appointment::where('patient_info_id', $patientInfoId)
            ->where('appointment_date', '>=', now())
            ->with('employeeInfo:id,first_name,last_name,date_of_birth,gender')
            ->orderBy('appointment_date', 'asc')
            ->take(5)
            ->get();
    }
}
