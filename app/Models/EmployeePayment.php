<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\EmployeeInfo|null $employeeInfo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment query()
 * @mixin \Eloquent
 */
class EmployeePayment extends Model
{
    protected $fillable = [
        'employee_info_id',
        'payment_date',
        'amount',
        'payment_method',
        'transaction_reference',
    ];

    public function employeeInfo(): BelongsTo
    {
        return $this->belongsTo(EmployeeInfo::class);
    }
}
