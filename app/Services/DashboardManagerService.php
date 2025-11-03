<?php

namespace App\Services;

use App\Interfaces\DashboardManagerServiceInterface;
use App\Models\EmployeeInfo;
use App\Models\PatientInfo;
use Auth;
use Carbon\Carbon;

class DashboardManagerService implements DashboardManagerServiceInterface
{
    public function getManagerDashboardData(): array
    {
        $requestingUser = Auth::user();

        $managerInfo = $requestingUser->employeeInfo->with('user')->first();
        $employeesByPosition = $this->getEmployeesByPosition();
        $totalPatients = $this->getTotalPatientsWithPastMonthComparison();
        $newPatientsByMonth = $this->getNewPatientsByMonth();

        return ['data' => [
            'managerInfo' => $managerInfo,
            'employeesByPosition' => $employeesByPosition,
            'totalPatients' => $totalPatients,
            'newPatientsByMonth' => $newPatientsByMonth,
        ]];
    }

    /**
     * Get employees count grouped by their positions.
     *
     * @return array{data: array, labels: array<int|string>}
     */
    private function getEmployeesByPosition(): array
    {
        $employees = EmployeeInfo::selectRaw('position, COUNT(id) as total')
            ->groupBy('position')
            ->get()
            ->pluck('total', 'position');

        return [
            'labels' => $employees->keys()->all(),
            'data' => $employees->values()->all(),
        ];
    }

    /**
     * Summary of the total patients with past month comparison.
     *
     * @return array{percentage_change: float, total: int}
     */
    private function getTotalPatientsWithPastMonthComparison()
    {
        $pastMonthDate = Carbon::now()->subMonth();
        $totalPatients = PatientInfo::count();
        $pastMonthPatients = PatientInfo::where('created_at', '<', $pastMonthDate)->count();

        $percentageChange = $pastMonthPatients > 0 ? (($totalPatients - $pastMonthPatients) / $pastMonthPatients) * 100 : 0;

        return [
            'total' => $totalPatients,
            'percentage_change' => round($percentageChange, 2),
        ];
    }

    /**
     * Get new patients count grouped by month for the past year.
     *
     * @return array{data: array, labels: string[]|array{data: array<int|mixed>, labels: string[]}}
     */
    private function getNewPatientsByMonth(): array
    {
        $startMonthDate = Carbon::now()->subMonths(11)->startOfMonth();
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
            'labels' => collect($labels)->map(fn ($l) => mb_substr($l, 0, 3))->all(),
            'data' => $data,
        ];
    }
}
