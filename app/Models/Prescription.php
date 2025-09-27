<?php

namespace App\Models;

use Database\Factories\PrescriptionFactory;
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
 * @property string $prescription_details
 * @property string $date_issued
 * @property string|null $date_expires
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\EmployeeInfo $employeeInfo
 * @property-read \App\Models\PatientInfo $patientInfo
 * @method static \Database\Factories\PrescriptionFactory factory($count = null, $state = [])
 * @method static Builder<static>|Prescription newModelQuery()
 * @method static Builder<static>|Prescription newQuery()
 * @method static Builder<static>|Prescription query()
 * @method static Builder<static>|Prescription whereCreatedAt($value)
 * @method static Builder<static>|Prescription whereDateExpires($value)
 * @method static Builder<static>|Prescription whereDateIssued($value)
 * @method static Builder<static>|Prescription whereEmployeeInfoId($value)
 * @method static Builder<static>|Prescription whereId($value)
 * @method static Builder<static>|Prescription wherePatientInfoId($value)
 * @method static Builder<static>|Prescription wherePrescriptionDetails($value)
 * @method static Builder<static>|Prescription whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Prescription extends Model
{
    /**
     * @use HasFactory<PrescriptionFactory>
     */
    use HasFactory;

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
