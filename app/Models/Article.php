<?php

namespace App\Models;

use Database\Factories\ArticleFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;


/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $subtitle
 * @property string $slug
 * @property string $excerpt
 * @property string $content_html
 * @property string|null $content_json
 * @property string|null $thumbnail
 * @property int $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Category> $categories
 * @property-read int|null $categories_count
 * @property-read int $reading_time
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ArticleFactory factory($count = null, $state = [])
 * @method static Builder<static>|Article newModelQuery()
 * @method static Builder<static>|Article newQuery()
 * @method static Builder<static>|Article query()
 * @method static Builder<static>|Article whereContentHtml($value)
 * @method static Builder<static>|Article whereContentJson($value)
 * @method static Builder<static>|Article whereCreatedAt($value)
 * @method static Builder<static>|Article whereExcerpt($value)
 * @method static Builder<static>|Article whereId($value)
 * @method static Builder<static>|Article whereIsPublished($value)
 * @method static Builder<static>|Article whereSlug($value)
 * @method static Builder<static>|Article whereSubtitle($value)
 * @method static Builder<static>|Article whereThumbnail($value)
 * @method static Builder<static>|Article whereTitle($value)
 * @method static Builder<static>|Article whereUpdatedAt($value)
 * @method static Builder<static>|Article whereUserId($value)
 * @mixin Eloquent
 */
class Article extends Model
{
    /** @use HasFactory<ArticleFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'subtitle',
        'slug',
        'excerpt',
        'content_html',
        'content_json',
        'thumbnail',
        'is_published',
    ];

    protected $appends = ['reading_time'];

    /**
     * Estimate reading time in minutes (integer).
     *
     * @return int
     */
    public function getReadingTimeAttribute(): int
    {
        $html = $this->content_html;
        $text = trim(strip_tags(html_entity_decode($html)));

        if ($text === '') {
            return 1;
        }

        $wpm = 200; // Average reading speed in words per minute
        $wordCount = str_word_count($text);

        return (int)max(1, ceil($wordCount / $wpm));
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'article_category')->withTimestamps();
    }
}
