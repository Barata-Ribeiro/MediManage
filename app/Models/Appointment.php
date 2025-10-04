<?php

namespace App\Models;

use Database\Factories\AppointmentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;


/**
 * @property int $id
 * @property int $patient_info_id
 * @property int $employee_info_id
 * @property string $appointment_date
 * @property string $status
 * @property string|null $reason_for_visit
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read EmployeeInfo $employeeInfo
 * @property-read PatientInfo $patientInfo
 * @method static AppointmentFactory factory($count = null, $state = [])
 * @method static Builder<static>|Appointment newModelQuery()
 * @method static Builder<static>|Appointment newQuery()
 * @method static Builder<static>|Appointment query()
 * @method static Builder<static>|Appointment whereAppointmentDate($value)
 * @method static Builder<static>|Appointment whereCreatedAt($value)
 * @method static Builder<static>|Appointment whereEmployeeInfoId($value)
 * @method static Builder<static>|Appointment whereId($value)
 * @method static Builder<static>|Appointment wherePatientInfoId($value)
 * @method static Builder<static>|Appointment whereReasonForVisit($value)
 * @method static Builder<static>|Appointment whereStatus($value)
 * @method static Builder<static>|Appointment whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Appointment extends Model
{
    /** @use HasFactory<AppointmentFactory> */
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'patient_info_id',
        'employee_info_id',
        'appointment_date',
        'status',
        'reason_for_visit',
    ];

    public function patientInfo(): BelongsTo
    {
        return $this->belongsTo(PatientInfo::class);
    }

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class);
    }
}
