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
        // List of tables from your MariaDB screenshot
        $tables = [
            'accountroles',
            'activity',
            'activityspecification',
            'office_department_division',
            'ticket',
            'ticketassignment',
            'ticketrelevance',
            'ticketstatus',
            'users'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                // Only add if it doesn't exist to prevent errors
                if (!Schema::hasColumn($table->getTable(), 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'accountroles', 'activity', 'activityspecification', 
            'office_department_division', 'ticket', 'ticketassignment', 
            'ticketrelevance', 'ticketstatus', 'users'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};