<?php

namespace App\Interfaces;

interface DashboardManagerServiceInterface
{
    /**
     * Get dashboard data for a specific manager.
     */
    public function getManagerDashboardData(): array;
}
