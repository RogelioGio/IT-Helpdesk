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
        // 1. Update Activity Table
        Schema::table('activity', function (Blueprint $table) {
            if (!Schema::hasColumn('activity', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 2. Update Activity Specification Table
        Schema::table('activityspecification', function (Blueprint $table) {
            if (!Schema::hasColumn('activityspecification', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback Activity
        Schema::table('activity', function (Blueprint $table) {
            if (Schema::hasColumn('activity', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

        // Rollback Activity Specification
        Schema::table('activityspecification', function (Blueprint $table) {
            if (Schema::hasColumn('activityspecification', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};