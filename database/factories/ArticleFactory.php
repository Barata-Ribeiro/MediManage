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
        $bgColor = fake()->hexColor();
        $thumbText = fake()->sentence(fake()->numberBetween(2, 5));

        return [
            'title' => fake()->sentence(),
            'subtitle' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->text(200),
            'content_html' => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'content_json' => json_encode(['blocks' => array_map(fn($p) => ['type' => 'paragraph', 'data' => ['text' => $p]], fake()->paragraphs(3))]),
            'thumbnail' => $this->fakeImageUrl(1920, 1080, $thumbText, $bgColor, 'FFFFFF', 'webp'),
            'is_published' => fake()->boolean(80),
        ];
    }

    private function fakeImageUrl(int $width, int $height, string $text, string $bg, string $color, string $format = 'jpeg'): string
    {
        $baseUrl = 'https://img.itisuniqueofficial.com/';

        $allowed = ['png', 'jpeg', 'gif', 'webp', 'svg'];
        $format = strtolower(trim((string)$format, ". \t\n\r\0\x0B"));
        if (!in_array($format, $allowed, true)) {
            $format = 'webp';
        }

        $params = [
            'width' => $width,
            'height' => $height,
            'text' => $text,
            'bg' => $bg,
            'color' => $color,
            'format' => $format,
        ];

        $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);

        return $baseUrl . '?' . $query;
    }
}
