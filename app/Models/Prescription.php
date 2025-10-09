<?php

namespace App\Models;

use Database\Factories\PrescriptionFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use InvalidArgumentException;
use Log;
use Throwable;
use UnexpectedValueException;


/**
 * @property int $id
 * @property string $validation_code
 * @property int $is_valid
 * @property int $patient_info_id
 * @property int $employee_info_id
 * @property string $prescription_details_html
 * @property string|null $prescription_details_json
 * @property string $date_issued
 * @property string|null $date_expires
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read EmployeeInfo $employeeInfo
 * @property-read PatientInfo $patientInfo
 * @method static PrescriptionFactory factory($count = null, $state = [])
 * @method static Builder<static>|Prescription newModelQuery()
 * @method static Builder<static>|Prescription newQuery()
 * @method static Builder<static>|Prescription query()
 * @method static Builder<static>|Prescription whereCreatedAt($value)
 * @method static Builder<static>|Prescription whereDateExpires($value)
 * @method static Builder<static>|Prescription whereDateIssued($value)
 * @method static Builder<static>|Prescription whereEmployeeInfoId($value)
 * @method static Builder<static>|Prescription whereId($value)
 * @method static Builder<static>|Prescription whereIsValid($value)
 * @method static Builder<static>|Prescription wherePatientInfoId($value)
 * @method static Builder<static>|Prescription wherePrescriptionDetailsHtml($value)
 * @method static Builder<static>|Prescription wherePrescriptionDetailsJson($value)
 * @method static Builder<static>|Prescription whereUpdatedAt($value)
 * @method static Builder<static>|Prescription whereValidationCode($value)
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
        'validation_code',
        'is_valid',
        'patient_info_id',
        'employee_info_id',
        'prescription_details_html',
        'prescription_details_json',
        'date_issued',
        'date_expires',
    ];


    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($prescription) {
            if (empty($prescription->validation_code)) {
                self::attemptToGenerateValidationCode($prescription);
            }

            $prescription->is_valid = self::computeValidity($prescription->date_expires);
        });

        static::updating(function ($prescription) {
            if ($prescription->isDirty('validation_code')) {
                throw new InvalidArgumentException('The validation_code field is immutable and cannot be changed.');
            }

            if ($prescription->isDirty('date_expires')) {
                $prescription->is_valid = self::computeValidity($prescription->date_expires);
            }
        });
    }

    /**
     * Attempt to generate a unique validation code.
     * If unable to do so after several attempts, fall back to a less robust method.
     *
     * @param $prescription
     * @return void
     */
    private static function attemptToGenerateValidationCode($prescription): void
    {
        try {
            $maxAttempts = 5;
            $attempt = 0;

            do {
                $code = strtoupper(bin2hex(random_bytes(8))); // 16 chars
                $attempt++;
            } while (Prescription::where('validation_code', $code)->exists() && $attempt < $maxAttempts);

            if ($attempt === $maxAttempts && Prescription::where('validation_code', $code)->exists()) {
                throw new UnexpectedValueException('Unable to generate a unique validation code after multiple attempts.');
            }

            $prescription->validation_code = $code;
        } catch (Throwable $e) {
            Log::error('There was an error generating validation code.', ['error' => $e->getMessage()]);
            $prescription->validation_code = strtoupper(substr(md5(uniqid('', true)), 0, 16));
        }
    }

    /**
     * Compute is_valid (1 = valid, 0 = expired) from date_expires.
     * If date_expires is empty, the prescription is considered valid.
     * If date_expires is invalid, the prescription is considered expired.
     *
     * @param string|null $dateExpires
     * @return int
     */
    private static function computeValidity(?string $dateExpires): int
    {
        if (empty($dateExpires)) {
            return 1;
        }

        try {
            $expires = Carbon::parse($dateExpires);
            return $expires->isFuture() ? 1 : 0;
        } catch (Throwable $e) {
            Log::warning('Invalid date_expires when computing validity', ['date_expires' => $dateExpires, 'error' => $e->getMessage()]);
            return 0;
        }
    }

    public function patientInfo(): BelongsTo
    {
        return $this->belongsTo(PatientInfo::class, 'patient_info_id');
    }

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class, 'employee_info_id');
    }
}
