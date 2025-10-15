<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class MedicalRecordEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $content = fake()->paragraphs(3);
        $entry_type = fake()->randomElement(['allergy', 'diagnosis', 'observation', 'note', 'vitals', 'immunization', 'lab_result', 'treatment', 'procedure', 'other']);

        return [
            'title' => fake()->sentence(),
            'content_html' => '<p>' . implode('</p><p>', $content) . '</p>',
            'content_json' => $this->getFormattedJson($content),
            'entry_type' => $entry_type,
            'is_visible_to_patient' => fake()->boolean(80),
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
}
