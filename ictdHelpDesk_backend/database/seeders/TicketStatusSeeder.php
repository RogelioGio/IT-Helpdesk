<?php

namespace Database\Seeders;

use App\Models\TicketStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'id' => 1,
                'name' => 'Open',
                'description' => 'The ticket has been created and successfully logged in the system. It is awaiting review.',
            ],
            [
                'id' => 2,
                'name' => 'Assigned',
                'description' => 'The ticket has been assigned to a specific support staff member or team for handling.',
            ],
            [
                'id' => 3,
                'name' => 'Responded',
                'description' => 'The assigned support personnel has provided an initial response, update, or requested information.',
            ],
            [
                'id' => 4,
                'name' => 'Resolved',
                'description' => 'The issue was resolved.',
            ],
            [
                'id' => 5,
                'name' => 'Closed',
                'description' => 'The reported issue has been resolved or completed. No further action is required.',
            ],
            [
                'id' => 6,
                'name' => 'Cancelled',
                'description' => 'The issue was cancelled.',
            ],
        ];

        foreach ($statuses as $status) {
            TicketStatus::updateOrCreate(
                ['id' => $status['id']],
                [
                    'name' => $status['name'],
                    'description' => $status['description'],
                ]
            );
        }
    }
}
