<?php

use App\Models\Appointment;
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
        ->where('appointment_date', '<', $now)
        ->chunk(100, fn($apts) => $apts->each(fn($apt) => $apt->update(['status' => 'missed'])));

    $this->info("Marked $missedAppointments appointments as missed.");
})->purpose('Mark missed appointments as missed in the system automatically')
    ->describe('This command checks for appointments that were scheduled in the past and updates their status to "missed" if they were not completed or canceled.');


$schedule = app(Schedule::class);

/** Schedule missed appointments marking
 * This command will run daily to mark missed appointments.
 * If in development environment, you can run it more frequently for testing purposes.
 */
$schedule->command('appointments:mark-missed-appointments')->daily()->withoutOverlapping();
