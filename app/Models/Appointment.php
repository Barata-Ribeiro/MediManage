<?php

namespace App\Models;

use Database\Factories\AppointmentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\BroadcastableModelEventOccurred;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $patient_info_id
 * @property int $employee_info_id
 * @property string $appointment_date
 * @property string $status
 * @property string|null $reason_for_visit
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\EmployeeInfo $employeeInfo
 * @property-read \App\Models\PatientInfo $patientInfo
 *
 * @method static \Database\Factories\AppointmentFactory factory($count = null, $state = [])
 * @method static Builder<static>|Appointment newModelQuery()
 * @method static Builder<static>|Appointment newQuery()
 * @method static Builder<static>|Appointment query()
 * @method static Builder<static>|Appointment whereAppointmentDate($value)
 * @method static Builder<static>|Appointment whereCreatedAt($value)
 * @method static Builder<static>|Appointment whereEmployeeInfoId($value)
 * @method static Builder<static>|Appointment whereId($value)
 * @method static Builder<static>|Appointment wherePatientInfoId($value)
 * @method static Builder<static>|Appointment whereReasonForVisit($value)
 * @method static Builder<static>|Appointment whereStatus($value)
 * @method static Builder<static>|Appointment whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
class Appointment extends Model
{
    /** @use HasFactory<AppointmentFactory> */
    use BroadcastsEvents, HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'patient_info_id',
        'employee_info_id',
        'appointment_date',
        'status',
        'reason_for_visit',
    ];

    public function patientInfo(): BelongsTo
    {
        return $this->belongsTo(PatientInfo::class);
    }

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class);
    }

    /**
     * Determine whether this Appointment should be broadcast for a given model event.
     *
     * Evaluates the provided event name and returns true when this Appointment instance
     * ought to be broadcast to subscribers/listeners for that event. Typical event names
     * include Eloquent model events such as "creating", "created", "updating", "updated",
     * "deleting", "deleted", "saving", "saved", etc.
     *
     * @param  string  $event  The name of the model event to evaluate.
     * @return bool True if the appointment should be broadcast for the given event, false otherwise.
     */
    public function broadcastWhen(string $event): bool
    {
        if ($event === 'updated') {
            return $this->wasChanged('status');
        }

        return false;
    }

    /**
     * Get the channels that model events should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(string $event): array
    {
        return [$this];
    }

    /**
     * Customize the data that will be broadcast for this model.
     *
     * Ensure related models (patient_info, employee_info, etc.) are loaded
     * so the client receives the full object instead of null relationships.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return $this->load([
            'employeeInfo' => fn ($q) => $q->select('id', 'user_id', 'first_name', 'last_name', 'gender', 'specialization')
                ->with('user:id,name,avatar'),
            'patientInfo' => fn ($q) => $q->select('id', 'user_id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'phone_number')
                ->with('user:id,name,avatar'),
        ])->toArray();
    }

    /**
     * Create a new broadcastable model event for the model.
     */
    protected function newBroadcastableEvent(string $event): BroadcastableModelEventOccurred
    {
        return (new BroadcastableModelEventOccurred($this, $event))->dontBroadcastToCurrentUser();
    }
}
