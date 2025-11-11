<?php

use App\Models\Appointment;
use App\Models\EmployeeInfo;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('appointments:mark-missed-appointments', function () {
    $now = Carbon::now();
    $statusToUpdate = ['scheduled', 'confirmed', 'checked_in'];

    $missedAppointments = Appointment::whereIn('status', $statusToUpdate)
        ->whereAppointmentDate('<', $now)
        ->chunk(100, fn ($apts) => $apts->each(fn ($apt) => $apt->update(['status' => $apt->status === 'checked_in' ? 'completed' : 'missed'])));

    $this->info("Marked $missedAppointments appointments as missed.");
})->purpose('Mark missed appointments as missed in the system automatically')
    ->describe('This command checks for appointments that were scheduled in the past and updates their status to "missed" if they were not completed or canceled.');

Artisan::command('contracts:deactivate-expired-employees', function () {
    $now = Carbon::now();
    $employeesWithExpiredContracts = EmployeeInfo::with('contracts')
        ->where('is_active', true)
        ->get()
        ->filter(function ($employee) use ($now) {
            if ($employee->active_contract) {
                return false;
            }

            $latest = $employee->contracts->sortByDesc('end_date')->first();

            return $latest && Carbon::parse($latest->end_date)->lt($now);
        });

    $employeesWithExpiredContracts->each(fn ($employee) => $employee->update(['is_active' => false]));

    $this->info("Deactivated {$employeesWithExpiredContracts->count()} employees with expired contracts.");
})->purpose('Deactivate employees with expired contracts automatically')
    ->describe('This command checks for employees whose contracts have expired and deactivates their accounts.');

$schedule = app(Schedule::class);

/** Schedule missed appointments marking
 * This command will run daily to mark missed appointments.
 * If in development environment, you can run it more frequently for testing purposes.
 */
if (app()->environment('local', 'development')) {
    $schedule->command('appointments:mark-missed-appointments')->everyFiveMinutes()->withoutOverlapping();
    $schedule->command('contracts:deactivate-expired-employees')->everyFiveMinutes()->withoutOverlapping();
} else {
    $schedule->command('appointments:mark-missed-appointments')->daily()->withoutOverlapping();
    $schedule->command('contracts:deactivate-expired-employees')->daily()->withoutOverlapping();
}
