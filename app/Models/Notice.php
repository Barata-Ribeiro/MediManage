<?php

namespace App\Models;

use Database\Factories\NoticeFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property string $type
 * @property int $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\User $user
 *
 * @method static \Database\Factories\NoticeFactory factory($count = null, $state = [])
 * @method static Builder<static>|Notice newModelQuery()
 * @method static Builder<static>|Notice newQuery()
 * @method static Builder<static>|Notice query()
 * @method static Builder<static>|Notice whereCreatedAt($value)
 * @method static Builder<static>|Notice whereDescription($value)
 * @method static Builder<static>|Notice whereId($value)
 * @method static Builder<static>|Notice whereIsActive($value)
 * @method static Builder<static>|Notice whereTitle($value)
 * @method static Builder<static>|Notice whereType($value)
 * @method static Builder<static>|Notice whereUpdatedAt($value)
 * @method static Builder<static>|Notice whereUserId($value)
 *
 * @mixin Eloquent
 */
class Notice extends Model
{
    /** @use HasFactory<NoticeFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'is_active',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
