<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserImportController extends Controller
{
    public function importCsv(Request $request)
    {
        // 1. Validate the file upload
        $request->validate([
            'csv_file' => 'required|mimes:csv,txt'
        ]);

        // 2. Open the file
        $file = fopen($request->file('csv_file')->getRealPath(), 'r');
        $rawHeaders = fgetcsv($file); // Read the first row (headers)
        
        // This maps your CSV column names to their position (0, 1, 2...)
        $headerMap = array_flip($rawHeaders);

        $importedCount = 0;

        // 3. Start a Transaction (Safety first!)
        DB::beginTransaction();

        try {
            while (($row = fgetcsv($file)) !== FALSE) {
                // Get the email from the specific column name in your screenshot
                $email = $row[$headerMap['Personal Email / LRA Issued Email']] ?? null;

                // Skip if email is empty or user already exists
                if (!$email || User::where('email', $email)->exists()) {
                    continue;
                }

                // 4. Create the User using your $fillable fields
                User::create([
                    'employeeID'   => $row[$headerMap['Employee Number']] ?? null,
                    'firstName'    => $row[$headerMap['First Name']] ?? '',
                    'lastName'     => $row[$headerMap['Last Name']] ?? '',
                    'middleName'   => null, 
                    'email'        => $email,
                    'username'     => $row[$headerMap['Account Username']] ?? Str::before($email, '@'),
                    'password'     => Hash::make($row[$headerMap['Employee Number']] ?? 'password123'),
                    'designation'  => 'Staff', 
                    'office_department_division_id' => 1, // Default ID
                    'account_role_id' => 2, // Default Role
                ]);

                $importedCount++;
            }

            DB::commit();
            fclose($file);

            return back()->with('success', "Success! $importedCount users were imported.");

        } catch (\Exception $e) {
            DB::rollBack();
            fclose($file);
            return back()->withErrors('Error: ' . $e->getMessage());
        }
    }
}