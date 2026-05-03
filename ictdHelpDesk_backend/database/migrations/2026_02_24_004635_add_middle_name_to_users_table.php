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
    Schema::table('users', function (Blueprint $table) {
        // Add your column here
        $table->string('middleName')->nullable()->after('firstName');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
      
        $table->dropColumn('phone_number');
    });
}
};
