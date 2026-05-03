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
        Schema::table('ticket', function (Blueprint $table) {
            // Adding a description column to store detailed ticket info
            // Placed after ticketId for better table organization
            $table->text('description')->nullable()->after('ticketId');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ticket', function (Blueprint $table) {
            // Necessary for rollbacks to keep MariaDB in sync
            $table->dropColumn('description');
        });
    }
};