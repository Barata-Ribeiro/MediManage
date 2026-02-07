<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $employee_info_id
 * @property string|null $payment_date
 * @property numeric $amount
 * @property string $payment_method
 * @property string|null $transaction_reference
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\EmployeeInfo $employeeInfo
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment whereEmployeeInfoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment wherePaymentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment whereTransactionReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmployeePayment whereUpdatedAt($value)
 *
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
