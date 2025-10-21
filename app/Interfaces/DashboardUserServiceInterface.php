<?php

namespace App\Interfaces;

interface DashboardUserServiceInterface
{
    /**
     * Get dashboard data for a specific user.
     *
     * @return array
     */
    public function getUserDashboardData(): array;
}
