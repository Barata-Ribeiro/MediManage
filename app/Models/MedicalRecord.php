<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $patient_info_id
 * @property string|null $medical_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MedicalRecordEntries> $medicalRecordEntries
 * @property-read int|null $medical_record_entries_count
 * @property-read \App\Models\PatientInfo $patientInfo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereMedicalNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord wherePatientInfoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MedicalRecord extends Model
{
    protected $table = 'medical_records';

    protected $fillable = [
        'patient_info_id',
        'medical_notes',
    ];

    public function patientInfo(): BelongsTo
    {
        return $this->belongsTo(PatientInfo::class);
    }

    public function medicalRecordEntries(): HasMany
    {
        return $this->hasMany(MedicalRecordEntries::class);
    }
}
