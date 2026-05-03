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
        // 1. Users Table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 2. Office Department Division Table
        Schema::table('office_department_division', function (Blueprint $table) {
            if (!Schema::hasColumn('office_department_division', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 3. Account Roles Table
        Schema::table('accountroles', function (Blueprint $table) {
            if (!Schema::hasColumn('accountroles', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 4. Activity Table
        Schema::table('activity', function (Blueprint $table) {
            if (!Schema::hasColumn('activity', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 5. Activity Specification Table
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
        // Rollback Users
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

        // Rollback Office Department
        Schema::table('office_department_division', function (Blueprint $table) {
            if (Schema::hasColumn('office_department_division', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

        // Rollback Account Roles
        Schema::table('accountroles', function (Blueprint $table) {
            if (Schema::hasColumn('accountroles', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

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