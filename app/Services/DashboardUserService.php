<?php

namespace App\Services;

use App\Interfaces\DashboardUserServiceInterface;
use App\Models\Appointment;
use Auth;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator as PaginationLengthAwarePaginator;

class DashboardUserService implements DashboardUserServiceInterface
{
    /**
     * Get data for the user dashboard.
     */
    public function getUserDashboardData(): array
    {
        $nextAppointments = $this->fetchUserNextAppointments(Auth::user()->patient_info_id);
        $profile = Auth::user()->load('patientInfo')->makeHidden(['permissions']);

        return [
            'data' => [
                'appointments' => $nextAppointments,
                'profile' => $profile,
            ],
        ];
    }


    /**
     * Fetch a paginated list of the patient's upcoming appointments.
     *
     * Queries for future appointments associated with the given patient_info id and
     * returns them as a length-aware paginator ordered by appointment datetime
     * ascending (nearest upcoming first). Implementations typically eager-load
     * related models.
     *
     * This is a private helper used by DashboardUserService to supply the dashboard
     * with the next appointments for a user.
     *
     * @param int $patientInfoId The patient_info record identifier to retrieve appointments for.
     * @return PaginationLengthAwarePaginator Paginated collection of upcoming appointment models.
     *
     * @internal For use within DashboardUserService only; not part of the public API.
     */
    private function fetchUserNextAppointments(int $patientInfoId): PaginationLengthAwarePaginator
    {
        if (! $patientInfoId) {
            return new PaginationLengthAwarePaginator([], 0, 10);
        }

        return Appointment::where('patient_info_id', $patientInfoId)
            ->where('appointment_date', '>=', now())
            ->with('employeeInfo:id,first_name,last_name,date_of_birth,gender')
            ->orderBy('appointment_date', 'asc')
            ->paginate(10)
            ->through(fn($a) => [
                'id' => $a->id,
                'time' => Carbon::parse($a->appointment_date)->format('H:i'),
                'date' => Carbon::parse($a->appointment_date)->format('F jS, Y'),
                'doctor' => $a->employeeInfo->getFullNameAttribute(),
                'status' => $a->status,
            ]);
    }
}
