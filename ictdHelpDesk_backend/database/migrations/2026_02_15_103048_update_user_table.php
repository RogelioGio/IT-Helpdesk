<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employeeID')->after('id');
            $table->string('firstName')->after('employeeID');
            $table->string('lastName')->after('firstName');
            $table->dropColumn('name');
            $table->dropColumn('email_verified_at');
            $table->dropColumn('remember_token');
            $table->string('username')->unique()->after('password');
            $table->string('designation')->after('username');
            $table->foreignId('office_department_division_id')->constrained('office_department_division')->after('designation')->onDelete('cascade');
            $table->foreignId('account_role_id')->constrained('accountroles')->after('office_department_division_id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
