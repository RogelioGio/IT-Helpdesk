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
        Schema::create('systemstatistics', function (Blueprint $table) {
            $table->id();
            $table->string('metric_key');
            $table->decimal('value', 15, 2)->default(0);
            $table->date('recorded_at');
            $table->timestamps();

            $table->index(['metric_key', 'recorded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('systemstatistics');
    }
};
