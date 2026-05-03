<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audits', function (Blueprint $table) {
            // Change auditable_id from integer to string to support your Ticket IDs
            $table->string('auditable_id')->change();
        });
    }

    public function down(): void
    {
        Schema::table('audits', function (Blueprint $table) {
            // Revert back to unsigned big integer if needed
            $table->unsignedBigInteger('auditable_id')->change();
        });
    }
};