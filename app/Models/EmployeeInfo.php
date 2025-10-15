<?php

namespace App\Models;

use Database\Factories\EmployeeInfoFactory;
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
 * @property int $user_id
 * @property string $first_name
 * @property string $last_name
 * @property string $gender
 * @property string $date_of_birth
 * @property string $phone_number
 * @property string $address
 * @property string|null $registration_number
 * @property string|null $registration_origin
 * @property string|null $specialization
 * @property string|null $license_number
 * @property string|null $license_expiry_date
 * @property string $position
 * @property int $is_active
 * @property string $hire_date
 * @property string|null $termination_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Appointment> $appointments
 * @property-read int|null $appointments_count
 * @property-read int|null $age
 * @property-read string $full_name
 * @property-read Collection<int, MedicalRecordEntry> $medicalRecordEntries
 * @property-read int|null $medical_record_entries_count
 * @property-read Collection<int, Prescription> $prescriptions
 * @property-read int|null $prescriptions_count
 * @property-read User $user
 * @method static EmployeeInfoFactory factory($count = null, $state = [])
 * @method static Builder<static>|EmployeeInfo newModelQuery()
 * @method static Builder<static>|EmployeeInfo newQuery()
 * @method static Builder<static>|EmployeeInfo query()
 * @method static Builder<static>|EmployeeInfo whereAddress($value)
 * @method static Builder<static>|EmployeeInfo whereCreatedAt($value)
 * @method static Builder<static>|EmployeeInfo whereDateOfBirth($value)
 * @method static Builder<static>|EmployeeInfo whereFirstName($value)
 * @method static Builder<static>|EmployeeInfo whereGender($value)
 * @method static Builder<static>|EmployeeInfo whereHireDate($value)
 * @method static Builder<static>|EmployeeInfo whereId($value)
 * @method static Builder<static>|EmployeeInfo whereIsActive($value)
 * @method static Builder<static>|EmployeeInfo whereLastName($value)
 * @method static Builder<static>|EmployeeInfo whereLicenseExpiryDate($value)
 * @method static Builder<static>|EmployeeInfo whereLicenseNumber($value)
 * @method static Builder<static>|EmployeeInfo wherePhoneNumber($value)
 * @method static Builder<static>|EmployeeInfo wherePosition($value)
 * @method static Builder<static>|EmployeeInfo whereRegistrationNumber($value)
 * @method static Builder<static>|EmployeeInfo whereRegistrationOrigin($value)
 * @method static Builder<static>|EmployeeInfo whereSpecialization($value)
 * @method static Builder<static>|EmployeeInfo whereTerminationDate($value)
 * @method static Builder<static>|EmployeeInfo whereUpdatedAt($value)
 * @method static Builder<static>|EmployeeInfo whereUserId($value)
 * @mixin Eloquent
 */
class EmployeeInfo extends Model
{
    /**
     * @use HasFactory<EmployeeInfoFactory>
     */
    use HasFactory;

    protected $table = 'employee_info';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'phone_number',
        'address',
        'registration_number',
        'registration_origin',
        'specialization',
        'license_number',
        'license_expiry_date',
        'position',
        'is_active',
        'hire_date',
        'termination_date',
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

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecordEntries(): HasMany
    {
        return $this->hasMany(MedicalRecordEntry::class);
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'employee_info_id');
    }
}
