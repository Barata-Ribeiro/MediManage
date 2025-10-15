<?php

namespace App\Services;

use App\Interfaces\DashboardAttendantServiceInterface;
use App\Models\Appointment;
use App\Models\EmployeeInfo;
use Auth;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DashboardAttendantService implements DashboardAttendantServiceInterface
{
    /**
     * @inheritDoc
     */
    public function getAttendantDashboardData(): array
    {
        $attendantInfo = EmployeeInfo::with('user')->where('user_id', Auth::id())->first();

        $startOfWorkDay = Carbon::now()->setTime(8, 0);
        $endOfWorkDay = Carbon::now()->setTime(17, 0);

        $upcomingToday = $this->getTodayUpcomingAppointments($startOfWorkDay, $endOfWorkDay);

        return [
            'data' => [
                'attendantInfo' => $attendantInfo,
                'upcomingToday' => $upcomingToday,
            ],
        ];
    }

    /**
     * Get today's upcoming appointments within working hours.
     *
     * @param Carbon $startOfWorkDay
     * @param Carbon $endOfWorkDay
     * @return LengthAwarePaginator
     */
    private function getTodayUpcomingAppointments($startOfWorkDay, $endOfWorkDay)
    {
        return Appointment::with('patientInfo', 'employeeInfo')
            ->whereDate('appointment_date', Carbon::today())
            ->whereBetween('appointment_date', [$startOfWorkDay, $endOfWorkDay])
            ->orderBy('appointment_date', 'asc')
            ->paginate(10)
            ->through(fn($a) => [
                'id' => $a->id,
                'time' => Carbon::parse($a->appointment_date)->format('H:i'),
                'doctor' => $a->employeeInfo->getFullNameAttribute(),
                'patient' => $a->patientInfo->getFullNameAttribute(),
                'status' => $a->status,
            ]);
    }
}
