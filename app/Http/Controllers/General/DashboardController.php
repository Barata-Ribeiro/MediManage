<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Services\DashboardAdminService;
use App\Services\DashboardAttendantService;
use App\Services\DashboardDoctorDoctorService;
use Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private DashboardDoctorDoctorService $dashboardDoctorService;
    private DashboardAdminService $dashboardAdminService;
    private DashboardAttendantService $dashboardAttendantService;

    public function __construct(DashboardDoctorDoctorService $dashboardDoctorService, DashboardAdminService $dashboardAdminService, DashboardAttendantService $dashboardAttendantService)
    {
        $this->dashboardDoctorService = $dashboardDoctorService;
        $this->dashboardAdminService = $dashboardAdminService;
        $this->dashboardAttendantService = $dashboardAttendantService;
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
            case 'Attendant':
                $data = $this->dashboardAttendantService->getAttendantDashboardData();
                return Inertia::render('dashboard/attendant-dashboard', $data);
            default:
                return Inertia::render('dashboard/user-dashboard', $data);
        }
    }
}
