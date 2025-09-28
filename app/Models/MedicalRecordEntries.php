<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;


/**
 * @property int $id
 * @property int $medical_record_id
 * @property int $employee_info_id
 * @property int $appointment_id
 * @property string $title
 * @property string $content_html
 * @property string|null $content_json
 * @property string $entry_type
 * @property int $is_visible_to_patient
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Appointment $appointment
 * @property-read EmployeeInfo $employeeInfo
 * @property-read MedicalRecord $medicalRecord
 * @method static Builder<static>|MedicalRecordEntries newModelQuery()
 * @method static Builder<static>|MedicalRecordEntries newQuery()
 * @method static Builder<static>|MedicalRecordEntries query()
 * @method static Builder<static>|MedicalRecordEntries whereAppointmentId($value)
 * @method static Builder<static>|MedicalRecordEntries whereContentHtml($value)
 * @method static Builder<static>|MedicalRecordEntries whereContentJson($value)
 * @method static Builder<static>|MedicalRecordEntries whereCreatedAt($value)
 * @method static Builder<static>|MedicalRecordEntries whereEmployeeInfoId($value)
 * @method static Builder<static>|MedicalRecordEntries whereEntryType($value)
 * @method static Builder<static>|MedicalRecordEntries whereId($value)
 * @method static Builder<static>|MedicalRecordEntries whereIsVisibleToPatient($value)
 * @method static Builder<static>|MedicalRecordEntries whereMedicalRecordId($value)
 * @method static Builder<static>|MedicalRecordEntries whereTitle($value)
 * @method static Builder<static>|MedicalRecordEntries whereUpdatedAt($value)
 * @mixin Eloquent
 */
class MedicalRecordEntries extends Model
{
    protected $table = 'medical_record_entries';

    protected $fillable = [
        'medical_record_id',
        'employee_info_id',
        'appointment_id',
        'title',
        'content_html',
        'content_json',
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
