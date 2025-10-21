<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Services\DashboardAdminService;
use App\Services\DashboardAttendantService;
use App\Services\DashboardDoctorDoctorService;
use App\Services\DashboardUserService;
use Auth;
use Inertia\Inertia;
use Log;

class DashboardController extends Controller
{
    private DashboardDoctorDoctorService $dashboardDoctorService;
    private DashboardAdminService $dashboardAdminService;
    private DashboardAttendantService $dashboardAttendantService;
    private DashboardUserService $dashboardUserService;

    public function __construct(
        DashboardDoctorDoctorService $dashboardDoctorService,
        DashboardAdminService $dashboardAdminService,
        DashboardAttendantService $dashboardAttendantService,
        DashboardUserService $dashboardUserService
    ) {
        $this->dashboardDoctorService = $dashboardDoctorService;
        $this->dashboardAdminService = $dashboardAdminService;
        $this->dashboardAttendantService = $dashboardAttendantService;
        $this->dashboardUserService = $dashboardUserService;
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
                $data = $this->dashboardUserService->getUserDashboardData();
                Log::debug('User Dashboard Data: ', $data);
                return Inertia::render('dashboard/user-dashboard', $data);
        }
    }
}
