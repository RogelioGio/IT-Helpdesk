<?php

namespace Database\Seeders;

use App\Models\TicketRelevance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketRelevanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ticketRelevance = [
            [
                'id' => 1,
                'relevanceCode' => 'P1',
                'name' => 'Critical',
                'description' => 'The entire organization or a large department is "down." There is no...',
            ],
            [
                'id' => 2,
                'relevanceCode' => 'P2',
                'name' => 'High',
                'description' => 'A large group of people is hampered, or a critical business process...',
            ],
            [
                'id' => 3,
                'relevanceCode' => 'P3',
                'name' => 'Medium',
                'description' => 'Work is still possible, but it is inconvenient or requires a manual...',
            ],
            [
                'id' => 4,
                'relevanceCode' => 'P4',
                'name' => 'Low',
                'description' => 'Little to no impact on productivity. Often includes routine requests.',
            ],
        ];

        foreach ($ticketRelevance as $level) {
            TicketRelevance::updateOrCreate(['id' => $level['id']],
            [
                'relevanceCode' => $level['relevanceCode'],
                'name'          => $level['name'],
                'description'   => $level['description'],
            ]);
        }
    }
}
