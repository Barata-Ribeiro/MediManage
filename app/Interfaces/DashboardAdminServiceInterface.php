<?php

namespace App\Interfaces;

interface DashboardAdminServiceInterface
{
    /**
     * Get dashboard data for admin.
     */
    public function getAdminDashboardData(): array;
}
