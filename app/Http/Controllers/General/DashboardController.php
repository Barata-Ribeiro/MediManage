<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Services\DashboardAdminService;
use App\Services\DashboardAttendantService;
use App\Services\DashboardDoctorDoctorService;
use App\Services\DashboardManagerService;
use App\Services\DashboardUserService;
use Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardDoctorDoctorService $dashboardDoctorService,
        private DashboardAdminService $dashboardAdminService,
        private DashboardAttendantService $dashboardAttendantService,
        private DashboardUserService $dashboardUserService,
        private DashboardManagerService $dashboardManagerService,
    ) {
        $this->dashboardDoctorService = $dashboardDoctorService;
        $this->dashboardAdminService = $dashboardAdminService;
        $this->dashboardAttendantService = $dashboardAttendantService;
        $this->dashboardUserService = $dashboardUserService;
        $this->dashboardManagerService = $dashboardManagerService;
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
            case 'Manager':
                $data = $this->dashboardManagerService->getManagerDashboardData();

                return Inertia::render('dashboard/manager-dashboard', $data);
            default:
                $data = $this->dashboardUserService->getUserDashboardData();

                return Inertia::render('dashboard/user-dashboard', $data);
        }
    }
}
