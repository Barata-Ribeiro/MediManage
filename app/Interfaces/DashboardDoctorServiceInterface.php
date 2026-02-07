<?php

namespace App\Interfaces;

interface DashboardDoctorServiceInterface
{
    /**
     * Get dashboard data for a specific doctor.
     */
    public function getDoctorDashboardData(): array;
}
