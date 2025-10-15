<?php

namespace App\Providers;

use App\Interfaces\DashboardDoctorServiceInterface;
use App\Services\DashboardDoctorDoctorService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

        $this->app->bind(
            DashboardDoctorServiceInterface::class,
            DashboardDoctorDoctorService::class
        );

		$this->app->bind(
			\App\Interfaces\DashboardAdminServiceInterface::class,
			\App\Services\DashboardAdminService::class
		);

		$this->app->bind(
			\App\Interfaces\DashboardAttendantServiceInterface::class,
			\App\Services\DashboardAttendantService::class
		);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
