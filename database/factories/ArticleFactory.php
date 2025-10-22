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
        $content = fake()->paragraphs(3);

        return [
            'title' => fake()->sentence(),
            'subtitle' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->text(200),
            'content_html' => '<p>' . implode('</p><p>', $content) . '</p>',
            'content_json' => $this->getFormattedJson($content),
            'thumbnail' => $this->fakeImageUrl(1920, 1080, $thumbText, $bgColor, 'FFFFFF', 'webp'),
            'is_published' => fake()->boolean(80),
        ];
    }

    /**
     * Get formatted JSON content for the editor.
     *
     * @param array|string $content
     * @return false|string
     */
    private function getFormattedJson(array|string $content): string|false
    {
        return json_encode([
            'root' => [
                'children' => array_map(function ($p) {
                    return [
                        'children' => [
                            [
                                'detail' => 0,
                                'format' => 0,
                                'mode' => 'normal',
                                'style' => '',
                                'text' => $p,
                                'type' => 'text',
                                'version' => 1
                            ]
                        ],
                        'direction' => null,
                        'format' => '',
                        'indent' => 0,
                        'type' => 'paragraph',
                        'version' => 1,
                        'textFormat' => 0,
                        'textStyle' => ''
                    ];
                }, $content),
                'direction' => null,
                'format' => '',
                'indent' => 0,
                'type' => 'root',
                'version' => 1
            ]
        ]);
    }

    /**
     * Build a dummyimage.com URL.
     *
     * Format examples:
     *  - https://dummyimage.com/300
     *  - https://dummyimage.com/300x200.png/09f/fff&text=Hello+World
     *
     * @param int $width
     * @param int $height Use 0 for square (width x width)
     * @param string $text Optional text to display on the image
     * @param string $bg Background hex color (with or without #). Defaults to cccccc
     * @param string $color Text hex color (with or without #). Defaults to 000000
     * @param string $format Image format/extension: png, jpg, jpeg, gif
     * @return string
     */
    private function fakeImageUrl(int $width, int $height = 0, string $text = '', string $bg = 'cccccc', string $color = '000000', string $format = 'png'): string
    {
        $baseUrl = 'https://dummyimage.com/';

        $width = max(1, (int)$width);
        $height = (int)$height;

        // Size: either "{width}" or "{width}x{height}"
        $size = $height > 0 ? sprintf('%dx%d', $width, $height) : (string)$width;

        // Normalization and Validation of format
        $format = strtolower(trim((string)$format, ". \t\n\r\0\x0B"));
        $allowed = ['png', 'jpg', 'jpeg', 'gif'];
        if (!in_array($format, $allowed, true)) {
            $format = 'png';
        }

        $bg = ltrim((string)$bg, '#');
        $color = ltrim((string)$color, '#');

        $bg = $bg === '' ? 'cccccc' : $bg;
        $color = $color === '' ? '000000' : $color;

        // Path construction
        $sizeSegment = $size . '.' . $format;
        $path = $sizeSegment . '/' . $bg . '/' . $color;

        if ($text !== '') {
            $path .= '&text=' . urlencode($text);
        }

        return $baseUrl . $path;
    }
}
