<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Database\Factories\MedicalRecordEntryFactory;


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
 * @property-read \App\Models\Appointment $appointment
 * @property-read \App\Models\EmployeeInfo $employeeInfo
 * @property-read \App\Models\MedicalRecord $medicalRecord
 * @method static \Database\Factories\MedicalRecordEntryFactory factory($count = null, $state = [])
 * @method static Builder<static>|MedicalRecordEntry newModelQuery()
 * @method static Builder<static>|MedicalRecordEntry newQuery()
 * @method static Builder<static>|MedicalRecordEntry query()
 * @method static Builder<static>|MedicalRecordEntry whereAppointmentId($value)
 * @method static Builder<static>|MedicalRecordEntry whereContentHtml($value)
 * @method static Builder<static>|MedicalRecordEntry whereContentJson($value)
 * @method static Builder<static>|MedicalRecordEntry whereCreatedAt($value)
 * @method static Builder<static>|MedicalRecordEntry whereEmployeeInfoId($value)
 * @method static Builder<static>|MedicalRecordEntry whereEntryType($value)
 * @method static Builder<static>|MedicalRecordEntry whereId($value)
 * @method static Builder<static>|MedicalRecordEntry whereIsVisibleToPatient($value)
 * @method static Builder<static>|MedicalRecordEntry whereMedicalRecordId($value)
 * @method static Builder<static>|MedicalRecordEntry whereTitle($value)
 * @method static Builder<static>|MedicalRecordEntry whereUpdatedAt($value)
 * @mixin Eloquent
 */
class MedicalRecordEntry extends Model
{

    /** @use HasFactory <MedicalRecordEntryFactory> */
    use HasFactory;

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
