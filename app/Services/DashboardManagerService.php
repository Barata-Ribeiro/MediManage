<?php

namespace App\Services;

use App\Interfaces\DashboardManagerServiceInterface;
use App\Models\Contract;
use App\Models\EmployeeInfo;
use App\Models\EmployeePayment;
use App\Models\Invoice;
use App\Models\PatientInfo;
use Auth;
use Carbon\Carbon;

class DashboardManagerService implements DashboardManagerServiceInterface
{
    public function getManagerDashboardData(): array
    {

        $managerInfo = EmployeeInfo::with('user')->whereUserId(Auth::id())->first();
        $employeesByPosition = $this->getEmployeesByPosition();
        $totalPatients = $this->getTotalPatientsWithPastMonthComparison();
        $newPatientsByMonth = $this->getNewPatientsByMonth();
        $contractsData = $this->getContractsData();
        $invoicesData = $this->getInvoicesData();
        $employeePaymentsData = $this->getEmployeePaymentsData();

        return ['data' => [
            'managerInfo' => $managerInfo,
            'employeesByPosition' => $employeesByPosition,
            'totalPatients' => $totalPatients,
            'newPatientsByMonth' => $newPatientsByMonth,
            'contractsData' => $contractsData,
            'invoicesData' => $invoicesData,
            'employeePaymentsData' => $employeePaymentsData,
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

    /**
     * Get contracts data for the dashboard.
     *
     * @return array{total_contracts: int, active_contracts: int, contracts_by_type: array, total_earnings_current_month: float}
     */
    private function getContractsData(): array
    {
        $totalContracts = Contract::count();
        $activeContracts = Contract::where('start_date', '<=', Carbon::today())
            ->where('end_date', '>=', Carbon::today())
            ->count();

        $contractsByType = Contract::selectRaw('contract_type, COUNT(id) as total')
            ->groupBy('contract_type')
            ->get()
            ->pluck('total', 'contract_type');

        return [
            'total_contracts' => $totalContracts,
            'active_contracts' => $activeContracts,
            'contracts_by_type' => [
                'labels' => $contractsByType->keys()->all(),
                'data' => $contractsByType->values()->all(),
            ],
        ];
    }

    /**
     * Get invoices data for the dashboard.
     *
     * @return array{total_invoices: int, total_amount: float, pending_invoices: int, paid_invoices: int, pending_amount: float}
     */
    private function getInvoicesData(): array
    {
        $totalInvoices = Invoice::count();
        $totalAmount = Invoice::sum('amount');
        $pendingInvoices = Invoice::where('status', '!=', 'paid')->count();
        $paidInvoices = Invoice::whereStatus('paid')->count();
        $pendingAmount = Invoice::where('status', '!=', 'paid')->sum('amount');

        return [
            'total_invoices' => $totalInvoices,
            'total_amount' => round($totalAmount, 2),
            'pending_invoices' => $pendingInvoices,
            'paid_invoices' => $paidInvoices,
            'pending_amount' => round($pendingAmount, 2),
        ];
    }

    /**
     * Get employee payments data for the dashboard.
     *
     * @return array{total_payments: int, total_amount_paid: float, payments_by_month: array}
     */
    private function getEmployeePaymentsData(): array
    {
        $totalPayments = EmployeePayment::count();
        $totalAmountPaid = EmployeePayment::sum('amount');

        $startMonthDate = Carbon::now()->subMonths(11)->startOfMonth();
        $endMonthDate = Carbon::now()->endOfMonth();

        $paymentsByMonth = EmployeePayment::selectRaw("DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(amount) as total")
            ->whereNotNull('payment_date')
            ->whereBetween('payment_date', [$startMonthDate, $endMonthDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total', 'month');

        $labels = [];
        $data = [];

        for ($i = 0; $i < 12; $i++) {
            $month = $startMonthDate->copy()->addMonths($i);
            $key = $month->format('Y-m');
            $labels[] = ucfirst($month->translatedFormat('F'));
            $data[] = round($paymentsByMonth->get($key, 0), 2);
        }

        return [
            'total_payments' => $totalPayments,
            'total_amount_paid' => round($totalAmountPaid, 2),
            'payments_by_month' => [
                'labels' => collect($labels)->map(fn ($l) => mb_substr($l, 0, 3))->all(),
                'data' => $data,
            ],
        ];
    }
}
