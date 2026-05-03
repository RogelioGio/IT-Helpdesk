<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
 public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Updated to use your actual columns: firstName and lastName
        $table->fullText(['firstName', 'lastName', 'email', 'username']);
    });

    Schema::table('ticket', function (Blueprint $table) {
        // Using columns found in your Ticket model
        $table->fullText(['description', 'findings', 'assetSerialNumber']);
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropFullText(['firstName', 'lastName', 'email', 'username']);
    });

    Schema::table('ticket', function (Blueprint $table) {
        $table->dropFullText(['description', 'findings', 'assetSerialNumber']);
    });
}
};