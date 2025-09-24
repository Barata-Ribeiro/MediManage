<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $medical_record_id
 * @property int $employee_info_id
 * @property int $appointment_id
 * @property string $title
 * @property string $content
 * @property string $entry_type
 * @property int $is_visible_to_patient
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Appointment $appointment
 * @property-read \App\Models\EmployeeInfo $employeeInfo
 * @property-read \App\Models\MedicalRecord $medicalRecord
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereAppointmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereEmployeeInfoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereEntryType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereIsVisibleToPatient($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereMedicalRecordId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecordEntries whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MedicalRecordEntries extends Model
{
    protected $table = 'medical_record_entries';

    protected $fillable = [
        'medical_record_id',
        'employee_info_id',
        'appointment_id',
        'title',
        'content',
        'entry_type',
        'is_visible_to_patient',
    ];

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}
