<?php

use App\Models\Appointment;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('App.Models.Appointment.{id}', function ($user, $id) {
    $userIsAttendantOrDoctor = $user->hasRole(['Attendant', 'Doctor']);
    $appointmentExists = Appointment::whereId($id)->exists();

    return $userIsAttendantOrDoctor && $appointmentExists;
});
