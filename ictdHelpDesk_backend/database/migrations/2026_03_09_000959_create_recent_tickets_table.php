<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recent_tickets', function (Blueprint $table) {
            // 1. Unique ID for this specific row
            $table->id();

            // 2. Link to the User (Foreign Key)
            // This tells Laravel: "Look for a user_id that exists in the users table"
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // 3. Link to the Ticket (Foreign Key)
            $table->foreignId('ticket_id')->constrained('ticket')->cascadeOnDelete();

            // 4. Record when this was created/updated
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recent_tickets');
    }
};