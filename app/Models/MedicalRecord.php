<?php

namespace App\Models;

use Database\Factories\MedicalRecordFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;


/**
 * @property int $id
 * @property int $patient_info_id
 * @property string $medical_notes_html
 * @property string|null $medical_notes_json
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\MedicalRecordEntry> $medicalRecordEntries
 * @property-read int|null $medical_record_entries_count
 * @property-read \App\Models\PatientInfo $patientInfo
 * @method static \Database\Factories\MedicalRecordFactory factory($count = null, $state = [])
 * @method static Builder<static>|MedicalRecord newModelQuery()
 * @method static Builder<static>|MedicalRecord newQuery()
 * @method static Builder<static>|MedicalRecord query()
 * @method static Builder<static>|MedicalRecord whereCreatedAt($value)
 * @method static Builder<static>|MedicalRecord whereId($value)
 * @method static Builder<static>|MedicalRecord whereMedicalNotesHtml($value)
 * @method static Builder<static>|MedicalRecord whereMedicalNotesJson($value)
 * @method static Builder<static>|MedicalRecord wherePatientInfoId($value)
 * @method static Builder<static>|MedicalRecord whereUpdatedAt($value)
 * @mixin Eloquent
 */
class MedicalRecord extends Model
{
    /**
     * @use HasFactory<MedicalRecordFactory>
     */
    use HasFactory;

    protected $table = 'medical_records';

    protected $fillable = [
        'patient_info_id',
        'medical_notes_html',
        'medical_notes_json',
    ];

    public function patientInfo(): BelongsTo
    {
        return $this->belongsTo(PatientInfo::class);
    }

    public function medicalRecordEntries(): HasMany
    {
        return $this->hasMany(MedicalRecordEntry::class);
    }
}
