<?php

namespace App\Interfaces;

interface DashboardDoctorServiceInterface
{
    /**
     * Get dashboard data for a specific doctor.
     *
     * @return array
     */
    public function getDoctorDashboardData(): array;
}
