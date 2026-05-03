<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Create the Lookup Table (Dropdown options)
        Schema::create('cancel_reasons', function (Blueprint $table) {
            $table->id();
            $table->string('reason'); 
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Create the Tracking Table
        Schema::create('cancellations', function (Blueprint $table) {
    $table->id();
    
    $table->foreignId('ticket_id')
          ->unique()
          ->constrained('ticket')
          ->onDelete('cascade');
    
    // Tracks WHICH user performed the cancellation
    $table->foreignId('cancelled_by')
          ->nullable()
          ->constrained('users')
          ->onDelete('set null');

    $table->foreignId('cancel_reason_id')
          ->nullable()
          ->constrained('cancel_reasons')
          ->onDelete('set null');
    
    $table->text('custom_reason')->nullable();
    
    // Explicit timestamp for when the cancellation happened
    $table->timestamp('cancelled_at')->nullable(); 
    
    $table->timestamps();
});
    }

    public function down(): void
    {
        // Drop in reverse order to avoid foreign key constraint errors
        Schema::dropIfExists('cancellations');
        Schema::dropIfExists('cancel_reasons');
    }
};