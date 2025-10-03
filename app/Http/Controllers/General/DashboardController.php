<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Services\DashboardAdminService;
use App\Services\DashboardDoctorDoctorService;
use Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private DashboardDoctorDoctorService $dashboardDoctorService;
    private DashboardAdminService $dashboardAdminService;

    public function __construct(DashboardDoctorDoctorService $dashboardDoctorService, DashboardAdminService $dashboardAdminService)
    {
        $this->dashboardDoctorService = $dashboardDoctorService;
        $this->dashboardAdminService = $dashboardAdminService;
    }

    /**
     * Display the dashboard view.
     */
    public function dashboard()
    {
        $userRole = Auth::user()->getRoleNames()->first();
        $data = [];

        switch ($userRole) {
            case 'Super Admin':
            case 'Admin':
                $data = $this->dashboardAdminService->getAdminDashboardData();
                return Inertia::render('dashboard/admin-dashboard', $data);
            case 'Doctor':
                $data = $this->dashboardDoctorService->getDoctorDashboardData();
                return Inertia::render('dashboard/doctor-dashboard', $data);
            default:
                return Inertia::render('dashboard/user-dashboard', $data);
        }
    }
}
