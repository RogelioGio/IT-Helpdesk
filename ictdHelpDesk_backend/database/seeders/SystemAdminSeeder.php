<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SystemAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $users = [
        [
            'email' => 'admin@email.com',
            'employeeID' => 'ADM-001',
            'firstName' => 'System',
            'middleName' => 'Root',
            'lastName' => 'Administrator',
            'username' => 'sysadmin',
            'password' => Hash::make('password'),
            'designation' => 'System Administrator',
            'office_department_division_id' => 16,
            'account_role_id' => 1,
        ],
        [
            'email' => 'arratrajano@gmail.com',
            'employeeID' => 'MGR-001',
            'firstName' => 'Arrabela',
            'middleName' => 'Loyola',
            'lastName' => 'Trajano',
            'username' => 'adelliah',
            'password' => Hash::make('password'),
            'designation' => 'Manager',
            'office_department_division_id' => 16,
            'account_role_id' => 3,
        ],
        [
            'email' => 'giotalingdan@gmail.com',
            'employeeID' => 'OFR-001',
            'firstName' => 'Gio',
            'middleName' => 'Constantino',
            'lastName' => 'Talingdan',
            'username' => 'giotalingdan',
            'password' => Hash::make('password'),
            'designation' => 'Information Technology Officer',
            'office_department_division_id' => 1,
            'account_role_id' => 4,
        ],
        [
            'email' => 'josh@gmail.com',
            'employeeID' => 'USR-001',
            'firstName' => 'Josh',
            'middleName' => '',
            'lastName' => 'Cuadra',
            'username' => 'joshcuadra',
            'password' => Hash::make('password'),
            'designation' => 'Information Technology Officer',
            'office_department_division_id' => 1,
            'account_role_id' => 5,
        ],
    ];

    foreach ($users as $user) {
        // We use 'email' as the unique identifier to check if they exist
        User::updateOrCreate(['email' => $user['email']], $user);
    }
}
}
