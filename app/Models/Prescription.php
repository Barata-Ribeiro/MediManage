<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $patient_info_id
 * @property int $employee_info_id
 * @property string $prescription_details
 * @property string $date_issued
 * @property string|null $date_expires
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\EmployeeInfo $employeeInfo
 * @property-read \App\Models\PatientInfo $patientInfo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription whereDateExpires($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription whereDateIssued($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription whereEmployeeInfoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription wherePatientInfoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription wherePrescriptionDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Prescription whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Prescription extends Model
{
    protected $table = 'prescriptions';

    protected $fillable = [
        'patient_info_id',
        'employee_info_id',
        'prescription_details',
        'date_issued',
        'date_expires',
    ];

    public function patientInfo(): BelongsTo
    {
        return $this->belongsTo(PatientInfo::class, 'patient_info_id');
    }

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class, 'employee_info_id');
    }
}
