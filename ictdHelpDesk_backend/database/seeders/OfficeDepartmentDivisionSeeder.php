<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OfficeDepartmentDivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // TODO: Change this to be more generic
        $offices = [
            ['id' => 1, 'officeCode' => 'FIN', 'name' => 'Finance Department', 'description' => 'Handles financial planning, accounting, budgeting, and reporting.'],
            ['id' => 2, 'officeCode' => 'HR', 'name' => 'Human Resources', 'description' => 'Manages recruitment, employee relations, payroll, and training.'],
            ['id' => 3, 'officeCode' => 'ADMIN', 'name' => 'Administration', 'description' => 'Provides general administrative and operational support services.'],
            ['id' => 4, 'officeCode' => 'IT', 'name' => 'IT Department', 'description' => 'Maintains systems, infrastructure, and technical support services.'],
            ['id' => 5, 'officeCode' => 'OPS', 'name' => 'Operations', 'description' => 'Oversees daily business operations and service delivery.'],
            ['id' => 6, 'officeCode' => 'LEGAL', 'name' => 'Legal Department', 'description' => 'Handles legal matters, compliance, and advisory services.'],
            ['id' => 7, 'officeCode' => 'PR', 'name' => 'Public Relations', 'description' => 'Manages communications, branding, and public engagement.'],
            ['id' => 8, 'officeCode' => 'PROC', 'name' => 'Procurement', 'description' => 'Handles purchasing, vendor management, and supply chain processes.'],
            ['id' => 9, 'officeCode' => 'LOG', 'name' => 'Logistics', 'description' => 'Manages inventory, transportation, and asset distribution.'],
            ['id' => 10, 'officeCode' => 'QA', 'name' => 'Quality Assurance', 'description' => 'Ensures products and services meet quality standards.'],
            ['id' => 11, 'officeCode' => 'RND', 'name' => 'Research and Development', 'description' => 'Develops new products, services, and process improvements.'],
            ['id' => 12, 'officeCode' => 'SALES', 'name' => 'Sales Department', 'description' => 'Handles sales strategies, client acquisition, and revenue generation.'],
            ['id' => 13, 'officeCode' => 'MKTG', 'name' => 'Marketing', 'description' => 'Manages promotions, campaigns, and market research.'],
            ['id' => 14, 'officeCode' => 'CS', 'name' => 'Customer Service', 'description' => 'Handles customer inquiries, support, and issue resolution.'],
            ['id' => 15, 'officeCode' => 'STRAT', 'name' => 'Strategy and Planning', 'description' => 'Oversees strategic planning and organizational development.'],
            ['id' => 16, 'officeCode' => 'EXEC', 'name' => 'Executive Office', 'description' => 'Provides leadership and direction for the organization.'],
        ];

        foreach ($offices as $office) {
            \App\Models\Office_Department_Division::updateOrCreate(['id' => $office['id']], $office);
        }
    }
}
