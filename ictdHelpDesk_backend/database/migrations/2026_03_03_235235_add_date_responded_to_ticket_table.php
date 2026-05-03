<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket', function (Blueprint $blueprint) {
            // Adding the dateResponded column after the assignment date
            $blueprint->timestamp('respondedDate')->nullable()->after('assignementDate');
        });
    }

    public function down(): void
    {
        Schema::table('ticket', function (Blueprint $blueprint) {
            $blueprint->dropColumn('respondedDate');
        });
    }
};