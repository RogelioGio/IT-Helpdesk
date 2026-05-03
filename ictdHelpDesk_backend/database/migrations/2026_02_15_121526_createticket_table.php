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
        Schema::create('ticket', function (Blueprint $table) {
            $table->id();
            $table->string('ticketId');
            $table->foreignId('activity_id')->constrained('activity')->onDelete('cascade');
            $table->foreignId('activitySpecification_id')->constrained('activityspecification')->onDelete('cascade');
            $table->string('assetSerialNumber');
            $table->foreignId('status_id')->constrained('ticketstatus')->onDelete('cascade');
            $table->foreignId('priority_id')->constrained('ticketrelevance')->onDelete('cascade');
            $table->foreignId('responder_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('requester_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('assignementDate')->nullable();
            $table->string('findings');
            $table->string('resolution');
            $table->timestamp('dateClosed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket');
    }
};
