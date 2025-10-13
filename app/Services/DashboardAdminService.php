<?php

namespace App\Services;

use App\Interfaces\DashboardAdminServiceInterface;
use App\Models\User;
use Asika\Agent\Agent;
use Carbon\Carbon;
use DB;
use Spatie\Permission\Models\Role;

class DashboardAdminService implements DashboardAdminServiceInterface
{
    /**
     * @inheritDoc
     */
    public function getAdminDashboardData(): array
    {

        $usersByRole = $this->getUsersByRole();
        $totalUsers = $this->getTotalUsersWithPastMonthComparison($usersByRole);
        $totalUsersByRole = $this->getTotalUsersByRoleWithPastMonthComparison($usersByRole);
        $newUsersPerMonth = $this->getNewUsersPerMonth();
        $allUserAgents = $this->getAllUserAgents();

        return [
            'data' => [
                'usersByRole' => $usersByRole,
                'totalUsers' => $totalUsers,
                'totalUsersByRole' => $totalUsersByRole,
                'newUsersPerMonth' => $newUsersPerMonth,
                'allUserAgents' => $allUserAgents,
            ],
        ];
    }

    /**
     * Get users count grouped by their roles.
     *
     * @return array
     */
    private function getUsersByRole(): array
    {
        $roles = Role::pluck('name');

        $usersByRole = User::selectRaw('roles.name as role, COUNT(users.id) as total')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->groupBy('roles.name')
            ->get()
            ->pluck('total', 'role')
            ->mapWithKeys(fn($v, $k) => [ucfirst(strtolower($k)) => $v])
            ->only($roles->map(fn($r) => ucfirst(strtolower($r)))->all());

        return [
            'labels' => $usersByRole->keys()->all(),
            'data' => $usersByRole->values()->all(),
        ];
    }

    /**
     * Get total users and percentage change compared to the previous month.
     *
     * @param array $usersByRole
     * @return array
     */
    private function getTotalUsersWithPastMonthComparison(array $usersByRole): array
    {
        $totalUsers = array_sum($usersByRole['data']);
        $pastMonthDate = Carbon::now()->subMonth();
        $pastTotalUsers = User::where('created_at', '<', $pastMonthDate)->count();

        $percentageChange = $pastTotalUsers > 0 ? (($totalUsers - $pastTotalUsers) / $pastTotalUsers) * 100 : 0;

        return [
            'total' => $totalUsers,
            'percentageChange' => round($percentageChange, 2),
        ];
    }

    /**
     * Get total users by role with percentage change compared to the previous month.
     *
     * @param array $usersByRole
     * @return array
     */
    private function getTotalUsersByRoleWithPastMonthComparison(array $usersByRole): array
    {
        $totalUsersByRole = [];
        $pastMonthDate = Carbon::now()->subMonth();

        foreach ($usersByRole['labels'] as $index => $role) {
            $currentTotal = $usersByRole['data'][$index];
            $pastTotal = User::whereHas('roles', function ($query) use ($role) {
                $query->where('name', $role);
            })->where('created_at', '<', $pastMonthDate)->count();

            $percentageChange = $pastTotal > 0 ? (($currentTotal - $pastTotal) / $pastTotal) * 100 : 0;

            $totalUsersByRole[$role] = [
                'total' => $currentTotal,
                'percentageChange' => round($percentageChange, 2),
            ];
        }

        return $totalUsersByRole;
    }

    /**
     * Get new users registered per month for the last 12 months.
     *
     * @return array
     */
    private function getNewUsersPerMonth(): array
    {
        $startMonthDate = Carbon::now()->subMonth(11)->startOfMonth();
        $endMonthDate = Carbon::now()->endOfMonth();

        $userByMonth = User::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as total")
            ->whereBetween('created_at', [$startMonthDate, $endMonthDate])
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
            $data[] = $userByMonth->get($key, 0);
        }

        return [
            'labels' => collect($labels)->map(fn($l) => mb_substr($l, 0, 3))->all(),
            'data' => $data,
        ];
    }

    /**
     * Get all user agents from sessions, grouped by user_agent with counts.
     *
     * @return array
     */
    private function getAllUserAgents(): array
    {
        $userAgents = DB::table(config('session.table'))
            ->selectRaw('user_agent, COUNT(*) as total')
            ->whereNotNull('user_agent')
            ->groupBy('user_agent')
            ->orderBy('total', 'desc')
            ->get()
            ->pluck('total', 'user_agent');

        foreach ($userAgents as $ua => $count) {
            $agent = new Agent();
            $agent->setUserAgent($ua);

            $browser = $agent->browser() ?: 'Unknown Browser';
            $version = $agent->version($browser) ?: '';
            $os = $agent->platform() ?: 'Unknown OS';

            $major = $version ? explode('.', $version)[0] : '';
            $key = trim($browser . ($major ? " {$major}" : '') . " / {$os}");

            $agentCounts[$key] = ($agentCounts[$key] ?? 0) + $count;
        }

        arsort($agentCounts);

        return [
            'labels' => array_keys($agentCounts),
            'data' => array_values($agentCounts),
        ];
    }
}
