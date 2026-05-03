<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySpecificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specifications = [
            // --- Activity 1: Hardware Support (RHS) ---
            ['activity_id' => 1, 'activitySpecificationCode' => 'DESK-01', 'name' => 'Desktop Problem', 'description' => 'Issues related to desktop computers including hardware failure, system errors, or performance problems.'],
            ['activity_id' => 1, 'activitySpecificationCode' => 'PRNT-02', 'name' => 'Printer Problem', 'description' => 'Printer malfunction, connectivity issues, driver errors, or printing failures.'],
            ['activity_id' => 1, 'activitySpecificationCode' => 'OS-03', 'name' => 'Corrupted Operating System', 'description' => 'Operating system failure, boot errors, corrupted system files, or system crashes requiring repair or reinstallation.'],
            ['activity_id' => 1, 'activitySpecificationCode' => 'LAP-04', 'name' => 'Laptop Problem', 'description' => 'Hardware or software issues affecting laptop devices including battery, display, or system performance.'],
            ['activity_id' => 1, 'activitySpecificationCode' => 'SCAN-05', 'name' => 'Scanner Problem', 'description' => 'Scanner device malfunction, driver issues, or connectivity problems.'],

            // --- Activity 2: Installation Services (INS) ---
            ['activity_id' => 2, 'activitySpecificationCode' => 'OS-01', 'name' => 'Reformat/Operating System Upgrade', 'description' => 'Reformatting a device or upgrading the operating system to improve performance, fix system errors, or enhance security and compatibility.'],
            ['activity_id' => 2, 'activitySpecificationCode' => 'MSO-02', 'name' => 'MS Office', 'description' => 'Installation, configuration, or reinstallation of Microsoft Office applications including Word, Excel, PowerPoint, Outlook, and related tools.'],
            ['activity_id' => 2, 'activitySpecificationCode' => 'SCD-03', 'name' => 'Scanner Driver', 'description' => 'Installation or updating of scanner drivers to ensure proper device detection, functionality, and compatibility with the operating system.'],
            ['activity_id' => 2, 'activitySpecificationCode' => 'AV-04', 'name' => 'Antivirus', 'description' => 'Installation and configuration of authorized antivirus or endpoint protection software to safeguard systems against malware and cyber threats.'],
            ['activity_id' => 2, 'activitySpecificationCode' => 'PRD-05', 'name' => 'Printer Driver', 'description' => 'Installation or reinstallation of printer drivers to enable printing services and resolve driver-related issues.'],
            // Note: Entries 12-16 in your list were duplicates of 7-11, usually handled by updateOrCreate

            // --- Activity 3: System Support (ISS) ---
            ['activity_id' => 3, 'activitySpecificationCode' => 'SD-01', 'name' => 'IT Service Desk', 'description' => 'Support for IT Service Desk system issues including ticket creation errors, status updates, user access management, and system performance concerns.'],
            ['activity_id' => 3, 'activitySpecificationCode' => 'ETS-02', 'name' => 'Expediente Tracking System', 'description' => 'Support and troubleshooting for the Expediente Tracking System including tracking errors, data inconsistencies, and access-related issues.'],
        ];

        foreach ($specifications as $spec) {
            \App\Models\ActivitySpecifications::updateOrCreate(
                ['activitySpecificationCode' => $spec['activitySpecificationCode']], // Unique identifier for update
                $spec // Data to insert or update
            );
        }
    }
}
