<?php

namespace App\Interfaces;

interface DashboardAdminServiceInterface
{
    /**
     * Get dashboard data for admin.
     *
     * @return array
     */
    public function getAdminDashboardData(): array;
}
