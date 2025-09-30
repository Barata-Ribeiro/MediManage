<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'subtitle' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->text(200),
            'content_html' => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'content_json' => json_encode(['blocks' => array_map(fn($p) => ['type' => 'paragraph', 'data' => ['text' => $p]], fake()->paragraphs(3))]),
            'thumbnail' => fake()->imageUrl(1920, 1080, 'nature', true),
            'is_published' => fake()->boolean(80),
        ];
    }
}
