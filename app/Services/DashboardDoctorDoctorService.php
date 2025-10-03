<?php

namespace App\Services;

use App\Interfaces\DashboardDoctorServiceInterface;
use App\Models\Appointment;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;
use Auth;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DashboardDoctorDoctorService implements DashboardDoctorServiceInterface
{

    /**
     * @inheritDoc
     */
    public function getDoctorDashboardData(): array
    {
        $doctorInfo = Auth::user()->employeeInfo;

        $startOfWorkDay = Carbon::now()->setTime(8, 0);
        $endOfWorkDay = Carbon::now()->setTime(17, 0);

        // Get overall day appointments grouped by hour
        $overallDayAppointmentsData = [];
        $overallDayAppointmentsLabels = [];
        $overallDayAppointments = $this->getOverallDayAppointments($doctorInfo, $startOfWorkDay, $endOfWorkDay);
        foreach (range(8, 16) as $hour) {
            $hourLabel = sprintf('%02d:00', $hour);
            $overallDayAppointmentsLabels[] = $hourLabel;
            $overallDayAppointmentsData[] = $overallDayAppointments->get($hourLabel, 0);
        }

        $appointmentsGenderOverview = $this->getAppointmentsGenderOverview($doctorInfo);
        $upcomingToday = $this->getTodayUpcomingAppointments($doctorInfo, $startOfWorkDay, $endOfWorkDay);
        $statusOverview = $this->getAppointmentsStatusOverview($doctorInfo);
        $weeklyTrend = $this->getWeeklyAppointmentsTrend($doctorInfo, 6);
        $distinctPatients30Days = $this->getDistinctPatientsLast30Days($doctorInfo);
        $newPatientsThisMonth = $this->getNewPatientsThisMonth();
        $newPatientsByMonth = $this->getNewPatientsByMonth();

        return [
            'data' => [
                'overallDayAppointments' => [
                    'labels' => $overallDayAppointmentsLabels,
                    'data' => $overallDayAppointmentsData,
                ],
                'appointmentsGenderOverview' => [
                    'labels' => $appointmentsGenderOverview->keys()->all(),
                    'data' => $appointmentsGenderOverview->values()->all(),
                ],
                'upcomingToday' => $upcomingToday, // array of upcoming appointments with time, patient name, status
                'appointmentsStatusOverview' => [
                    'labels' => $statusOverview->keys()->all(),
                    'data' => $statusOverview->values()->all(),
                ],
                'weeklyAppointmentsTrend' => [
                    'labels' => $weeklyTrend->keys()->all(),
                    'data' => $weeklyTrend->values()->all(),
                ],
                'distinctPatientsLast30Days' => $distinctPatients30Days,
                'newPatientsThisMonth' => $newPatientsThisMonth,
                'newPatientsByMonth' => $newPatientsByMonth,
            ]
        ];
    }

    /**
     * Get overall day appointments grouped by hour.
     *
     * @param EmployeeInfo|null $doctorInfo
     * @param Carbon $startOfWorkDay
     * @param Carbon $endOfWorkDay
     * @return Collection
     */
    private function getOverallDayAppointments(?EmployeeInfo $doctorInfo, Carbon $startOfWorkDay, Carbon $endOfWorkDay): Collection
    {
        if (!$doctorInfo) {
            return collect();
        }

        return Appointment::selectRaw("DATE_FORMAT(appointment_date, '%H:00') as hour, COUNT(*) as total")
            ->where('employee_info_id', $doctorInfo->id)
            ->whereBetween('appointment_date', [$startOfWorkDay, $endOfWorkDay])
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->pluck('total', 'hour')
            ->union(collect(array_fill_keys(collect(range(8, 16))
                ->map(fn($h) => sprintf('%02d:00', $h))
                ->toArray(), 0)))
            ->sortKeys();
    }

    /**
     * Get appointments number by patient gender
     *
     * @param EmployeeInfo|null $doctorInfo
     * @return Collection
     */
    private function getAppointmentsGenderOverview(?EmployeeInfo $doctorInfo): Collection
    {
        if (!$doctorInfo) {
            return collect();
        }

        return Appointment::selectRaw("patient_info.gender as gender, COUNT(*) as total")
            ->join('patient_info', 'appointments.patient_info_id', '=', 'patient_info.id')
            ->where('employee_info_id', $doctorInfo->id)
            ->groupBy('patient_info.gender')
            ->orderBy('patient_info.gender')
            ->pluck('total', 'gender')
            ->mapWithKeys(fn($v, $k) => [ucfirst(strtolower($k)) => $v])
            ->union(collect(array_fill_keys(
                DB::table('patient_info')->distinct()->pluck('gender')->map(fn($g) => ucfirst(strtolower($g)))->toArray(),
                0
            )))
            ->sortKeys();
    }

    /**
     * Today's upcoming appointments (during work hours) with patient name and status.
     *
     * @param EmployeeInfo|null $doctorInfo
     * @param Carbon $startOfWorkDay
     * @param Carbon $endOfWorkDay
     * @return array
     */
    private function getTodayUpcomingAppointments(?EmployeeInfo $doctorInfo, Carbon $startOfWorkDay, Carbon $endOfWorkDay): array
    {
        if (!$doctorInfo) {
            return [];
        }

        return Appointment::with('patientInfo')
            ->where('employee_info_id', $doctorInfo->id)
            ->whereDate('appointment_date', Carbon::today())
            ->whereBetween('appointment_date', [$startOfWorkDay, $endOfWorkDay])
            ->orderBy('appointment_date')
            ->get()
            ->map(function (Appointment $a) {
                $time = Carbon::parse($a->appointment_date)->format('H:i');
                $patientName = $a->patientInfo ? trim($a->patientInfo->first_name . ' ' . $a->patientInfo->last_name) : null;
                return [
                    'time' => $time,
                    'patient' => $patientName,
                    'status' => $a->status,
                ];
            })
            ->toArray();
    }

    /**
     * Appointment status counts for the doctor. Ensures common statuses appear even if zero.
     *
     * @param EmployeeInfo|null $doctorInfo
     * @return Collection
     */
    private function getAppointmentsStatusOverview(?EmployeeInfo $doctorInfo): Collection
    {
        if (!$doctorInfo) {
            return collect();
        }

        $defaultStatuses = ['scheduled', 'confirmed', 'checked_in', 'canceled', 'missed', 'completed'];

        $counts = Appointment::selectRaw("LOWER(status) as status, COUNT(*) as total")
            ->where('employee_info_id', $doctorInfo->id)
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status')
            ->mapWithKeys(fn($v, $k) => [ucfirst(strtolower($k)) => $v]);

        $defaultsMap = collect(array_fill_keys(array_map(fn($s) => ucfirst(strtolower($s)), $defaultStatuses), 0));

        return $counts->union($defaultsMap)->sortKeys();
    }

    /**
     * 6-week appointments trend (configurable number of weeks).
     *
     * @param EmployeeInfo|null $doctorInfo
     * @param int $weeks
     * @return Collection
     */
    private function getWeeklyAppointmentsTrend(?EmployeeInfo $doctorInfo, int $weeks = 6): Collection
    {
        if (!$doctorInfo) {
            return collect();
        }

        $labels = [];
        $data = [];

        for ($i = $weeks - 1; $i >= 0; $i--) {
            $start = Carbon::now()->subWeeks($i)->startOfWeek();
            $end = (clone $start)->endOfWeek();
            $label = $start->format('Y-m-d'); // week start label
            $count = Appointment::where('employee_info_id', $doctorInfo->id)
                ->whereBetween('appointment_date', [$start, $end])
                ->count();
            $labels[] = $label;
            $data[] = $count;
        }

        return collect($data)->values()->zip($labels)->mapWithKeys(fn($pair) => [$pair[1] => $pair[0]]);
    }

    /**
     * Distinct patients seen by the doctor in the last 30 days.
     *
     * @param EmployeeInfo|null $doctorInfo
     * @return int
     */
    private function getDistinctPatientsLast30Days(?EmployeeInfo $doctorInfo): int
    {
        if (!$doctorInfo) {
            return 0;
        }

        return Appointment::where('employee_info_id', $doctorInfo->id)
            ->whereBetween('appointment_date', [Carbon::now()->subDays(30), Carbon::now()])
            ->distinct('patient_info_id')
            ->count('patient_info_id');
    }

    /**
     * New patients created this month (for the clinic).
     *
     * @return int
     */
    private function getNewPatientsThisMonth(): int
    {
        return PatientInfo::whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->count();
    }

    /**
     * New patients by month for the last 12 months (for the clinic).
     *
     * @return array[]
     */
    private function getNewPatientsByMonth(): array
    {
        $startMonthDate = Carbon::now()->subMonth(11)->startOfMonth();
        $endMonthDate = Carbon::now()->endOfMonth();

        $labels = [];
        $data = [];

        $patientsByMonth = PatientInfo::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as total")
            ->whereBetween('created_at', [$startMonthDate, $endMonthDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total', 'month');

        for ($i = 0; $i < 12; $i++) {
            $month = $startMonthDate->copy()->addMonths($i);
            $key = $month->format('Y-m');
            $labels[] = ucfirst($month->translatedFormat('F'));
            $data[] = $patientsByMonth->get($key, 0);
        }

        return [
            'labels' => collect($labels)->map(fn($l) => mb_substr($l, 0, 3))->all(),
            'data' => $data,
        ];
    }
}
