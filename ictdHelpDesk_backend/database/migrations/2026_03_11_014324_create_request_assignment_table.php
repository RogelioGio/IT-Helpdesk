<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requestassignment', function (Blueprint $blueprint) {
            $blueprint->id();
            // Foreign key to the ticket table
            $blueprint->unsignedBigInteger('ticket_id');
            // Foreign key to the users table
            $blueprint->unsignedBigInteger('user_id');
            
            $blueprint->timestamps();
            $blueprint->softDeletes(); // Enabled as requested

            // Constraints
            $blueprint->foreign('ticket_id')->references('id')->on('ticket')->onDelete('cascade');
            $blueprint->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requestassignment');
    }
};