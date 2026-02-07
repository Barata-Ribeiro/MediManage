<?php

namespace App\Interfaces;

interface DashboardAttendantServiceInterface
{
    /**
     * Get data for the attendant dashboard.
     */
    public function getAttendantDashboardData(): array;
}
