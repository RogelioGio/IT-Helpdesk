<?php

namespace Database\Seeders;

use App\Models\CancelReason;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CancelReasonsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reasons = [
            [
                'id' => 1,
                'reason' => 'Hardware under warranty',
                'description' => 'The device is still covered by the manufacturer or vendor warranty.',
            ],
            [
                'id' => 2,
                'reason' => 'Out-Of-Warranty',
                'description' => 'Warranty period has expired. Repair may require external parts procurement.',
            ],
            [
                'id' => 3,
                'reason' => 'Corrupted Operating System',
                'description' => 'Issue is software-based. Requires a fresh OS installation.',
            ],
            [
                'id' => 4,
                'reason' => 'Temporary Unit Deployment',
                'description' => 'A loaner unit has been deployed while the original asset is under repair.',
            ],
        ];

        foreach ($reasons as $spec) {
            CancelReason::updateOrCreate(
                ['id' => $spec['id']],
                [
                    'reason' => $spec['reason'],
                    'description' => $spec['description'],
                ]
            );
        }
    }
}
