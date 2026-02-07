<?php

namespace App\Interfaces;

interface DashboardUserServiceInterface
{
    /**
     * Get dashboard data for a specific user.
     */
    public function getUserDashboardData(): array;
}
