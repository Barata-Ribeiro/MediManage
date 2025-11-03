<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property-read \App\Models\PatientInfo|null $patientInfo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice query()
 * @mixin \Eloquent
 */
class Invoice extends Model
{
    protected $fillable = [
        'patient_info_id',
        'consultation_date',
        'notes',
        'due_date',
        'amount',
        'payment_method',
        'status',
    ];

    public function patientInfo()
    {
        return $this->belongsTo(PatientInfo::class);
    }
}
