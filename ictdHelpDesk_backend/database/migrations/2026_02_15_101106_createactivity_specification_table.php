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
        Schema::create('activityspecification', function (Blueprint $table) {
            $table->id();
            $table->string('activitySpecificationCode');
            $table->string('name');
            $table->string('description');

            $table->foreignId('activity_id')->constrained('activity')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activitySpecification');
    }
};
