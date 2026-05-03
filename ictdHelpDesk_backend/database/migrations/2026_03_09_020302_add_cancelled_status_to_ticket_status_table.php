<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // DB::table('ticketstatus')->insert([
        //     'id' => 6,
        //     'name' => 'Cancelled',
        //     'description' => 'The ticket has been cancelled by the requester or administration. No further action will be taken.',
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('ticketstatus')->where('id', 6)->delete();
    }
};
