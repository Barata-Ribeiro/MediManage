<?php

namespace App\Models;

use Database\Factories\PatientInfoFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int|null $medical_record_id
 * @property string $first_name
 * @property string $last_name
 * @property string $gender
 * @property string $date_of_birth
 * @property string $phone_number
 * @property string $address
 * @property string $insurance_company
 * @property string $insurance_member_id_number
 * @property string $insurance_group_number
 * @property string $insurance_policy_number
 * @property string|null $emergency_contact_name
 * @property string|null $emergency_contact_relationship
 * @property string|null $emergency_contact_phone_number
 * @property string|null $allergies
 * @property string|null $current_medications
 * @property string|null $past_illnesses
 * @property string|null $surgeries
 * @property string|null $family_medical_history
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Appointment> $appointments
 * @property-read int|null $appointments_count
 * @property-read int|null $age
 * @property-read string $full_name
 * @property-read MedicalRecord|null $medicalRecord
 * @property-read Collection<int, MedicalRecordEntries> $medicalRecordEntries
 * @property-read int|null $medical_record_entries_count
 * @property-read Collection<int, Prescription> $prescriptions
 * @property-read int|null $prescriptions_count
 * @property-read User|null $user
 * @method static \Database\Factories\PatientInfoFactory factory($count = null, $state = [])
 * @method static Builder<static>|PatientInfo newModelQuery()
 * @method static Builder<static>|PatientInfo newQuery()
 * @method static Builder<static>|PatientInfo query()
 * @method static Builder<static>|PatientInfo whereAddress($value)
 * @method static Builder<static>|PatientInfo whereAllergies($value)
 * @method static Builder<static>|PatientInfo whereCreatedAt($value)
 * @method static Builder<static>|PatientInfo whereCurrentMedications($value)
 * @method static Builder<static>|PatientInfo whereDateOfBirth($value)
 * @method static Builder<static>|PatientInfo whereEmergencyContactName($value)
 * @method static Builder<static>|PatientInfo whereEmergencyContactPhoneNumber($value)
 * @method static Builder<static>|PatientInfo whereEmergencyContactRelationship($value)
 * @method static Builder<static>|PatientInfo whereFamilyMedicalHistory($value)
 * @method static Builder<static>|PatientInfo whereFirstName($value)
 * @method static Builder<static>|PatientInfo whereGender($value)
 * @method static Builder<static>|PatientInfo whereId($value)
 * @method static Builder<static>|PatientInfo whereInsuranceCompany($value)
 * @method static Builder<static>|PatientInfo whereInsuranceGroupNumber($value)
 * @method static Builder<static>|PatientInfo whereInsuranceMemberIdNumber($value)
 * @method static Builder<static>|PatientInfo whereInsurancePolicyNumber($value)
 * @method static Builder<static>|PatientInfo whereLastName($value)
 * @method static Builder<static>|PatientInfo whereMedicalRecordId($value)
 * @method static Builder<static>|PatientInfo wherePastIllnesses($value)
 * @method static Builder<static>|PatientInfo wherePhoneNumber($value)
 * @method static Builder<static>|PatientInfo whereSurgeries($value)
 * @method static Builder<static>|PatientInfo whereUpdatedAt($value)
 * @method static Builder<static>|PatientInfo whereUserId($value)
 * @mixin Eloquent
 */
class PatientInfo extends Model
{

    /**
     * @use HasFactory<PatientInfoFactory>
     */
    use HasFactory;

    protected $table = 'patient_info';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'phone_number',
        'address',
        'insurance_company',
        'insurance_member_id_number',
        'insurance_group_number',
        'insurance_policy_number',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_phone_number',
        'allergies',
        'current_medications',
        'past_illnesses',
        'surgeries',
        'family_medical_history',
    ];

    /**
     * Appended accessors to include in the model's array and JSON forms.
     *
     * @var string[]
     */
    protected $appends = [
        'full_name',
        'age'
    ];

    /**
     * Get the patient's full name.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return "$this->first_name $this->last_name";
    }

    /**
     * Calculate age from date_of_birth on the fly.
     *
     * @return int|null
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->date_of_birth) {
            return null;
        }

        return Carbon::parse($this->date_of_birth)->age;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function medicalRecord(): HasOne
    {
        return $this->hasOne(MedicalRecord::class, 'patient_info_id');
    }

    public function medicalRecordEntries(): HasMany
    {
        return $this->hasMany(MedicalRecordEntries::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'patient_info_id');
    }
}
