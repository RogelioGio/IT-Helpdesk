<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'id' => 1,
                'name' => 'System Admin',
                'description' => 'Has full system control including user management, role configuration, system settings, and database-level access.',
            ],
            [
                'id' => 2,
                'name' => 'Administrator',
                'description' => 'Manages the system configuration and has the highest level of access.',
            ],
            [
                'id' => 3,
                'name' => 'Manager',
                'description' => 'Person that manages the ticket given to the system and can assign it to an officer.',
            ],
            [
                'id' => 4,
                'name' => 'Officer',
                'description' => 'Respondent for the assigned ticket and can update the status of the ticket.',
            ],
            [
                'id' => 5,
                'name' => 'User',
                'description' => 'End users that mainly create tickets and ask for assistance.',
            ],
        ];

        foreach ($roles as $role) {
            \App\Models\AccountRoles::updateOrCreate(['id' => $role['id']], $role);
        };
    }

}
