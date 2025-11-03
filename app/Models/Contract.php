<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\EmployeeInfo|null $employeeInfo
 * @property-read mixed $duration
 * @property-read mixed $total_earnings
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract query()
 * @mixin \Eloquent
 */
class Contract extends Model
{
    protected $fillable = [
        'employee_info_id',
        'start_date',
        'end_date',
        'rate_type',
        'rate',
        'contract_type',
    ];

    /**
     * Get the duration of the contract in a human-readable format.
     */
    public function getDurationAttribute()
    {
        return Carbon::parse($this->start_date)->diffForHumans($this->end_date);
    }

    /**
     * Calculate total earnings for the contract based on rate type.
     */
    public function getTotalEarningsAttribute($monthYear)
    {
        return $this->rate_type === 'monthly' ? $this->rate : $this->rate * Carbon::parse($monthYear)->daysInMonth;
    }

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class);
    }
}
