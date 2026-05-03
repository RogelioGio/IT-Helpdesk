<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activities = [
            ['id' => 1, 'name' => 'Repair of Hardware and Software', 'activityCode' => 'RHS', 'description' => 'Assistance with hardware-related issues, including troubleshooting, repairs, and maintenance.'],
            ['id' => 2, 'name' => 'Installation of Software', 'activityCode' => 'INS', 'description' => 'Help with software installation, configuration, updates, and troubleshooting.'],
            ['id' => 3, 'name' => 'Information Systems Support', 'activityCode' => 'ISS', 'description' => 'Support for network connectivity issues, including Wi-Fi problems, VPN setup, and network performance optimization.'],
        ];

        foreach ($activities as $activity) {
           \App\Models\Activity::updateOrCreate(['id' => $activity['id']], $activity);
        }
    }
}
