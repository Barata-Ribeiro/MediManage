<?php

namespace App\Models;

use Database\Factories\PrescriptionFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Log;
use RuntimeException;
use Throwable;


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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($prescription) {
            if (empty($prescription->validation_code)) {
                try {
                    $maxAttempts = 5;
                    $attempt = 0;

                    do {
                        $code = strtoupper(bin2hex(random_bytes(8))); // 16 chars
                        $attempt++;
                    } while (Prescription::where('validation_code', $code)->exists() && $attempt < $maxAttempts);

                    if ($attempt === $maxAttempts && Prescription::where('validation_code', $code)->exists()) {
                        throw new RuntimeException('Could not generate unique validation_code.');
                    }

                    $prescription->validation_code = $code;
                } catch (Throwable $e) {
                    Log::error('There was an error generating validation code.', ['error' => $e->getMessage()]);
                    $prescription->validation_code = strtoupper(substr(md5(uniqid('', true)), 0, 16));
                }
            }

            $prescription->is_valid = self::computeValidity($prescription->date_expires);
        });

        static::updating(function ($prescription) {
            if ($prescription->isDirty('validation_code')) {
                throw new RuntimeException('The validation_code field is immutable and cannot be changed.');
            }

            if ($prescription->isDirty('date_expires')) {
                $prescription->is_valid = self::computeValidity($prescription->date_expires);
            }
        });
    }

    /**
     * Compute is_valid (1 = valid, 0 = expired) from date_expires.
     */
    private static function computeValidity($dateExpires): int
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
