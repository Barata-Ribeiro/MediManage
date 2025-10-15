<?php

namespace App\Interfaces;

interface DashboardAttendantServiceInterface
{
    /**
     * Get data for the attendant dashboard.
     *
     * @return array
     */
    public function getAttendantDashboardData(): array;
}
