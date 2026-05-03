<?php

namespace Database\Seeders;

use App\Models\FeedbackDimension;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeedbackDimensionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dimensions = [
            [
                'id' => 1,
                'dimension' => 'Responsiveness',
                'description' => 'Ability to provide prompt service and respond quickly to requests or concerns.',
            ],
            [
                'id' => 2,
                'dimension' => 'Reliability',
                'description' => 'Ability to deliver the service accurately and consistently as expected.',
            ],
            [
                'id' => 3,
                'dimension' => 'Communication',
                'description' => 'Clarity, politeness, and effectiveness in conveying information to clients.',
            ],
            [
                'id' => 4,
                'dimension' => 'Integrity',
                'description' => 'Honesty, transparency, and fairness in delivering the service.',
            ],
            [
                'id' => 5,
                'dimension' => 'Assurance',
                'description' => 'Knowledge, competence, and professionalism of personnel in delivering services.',
            ],
            [
                'id' => 6,
                'dimension' => 'Outcome',
                'description' => 'Extent to which the service meets the needs and expectations of the client.',
            ],
        ];

        foreach ($dimensions as $data) {
            FeedbackDimension::updateOrCreate(
                ['id' => $data['id']],
                [
                    'dimension' => $data['dimension'],
                    'description' => $data['description'],
                ]
            );
        }

    }
}
