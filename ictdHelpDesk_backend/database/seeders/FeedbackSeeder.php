<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run()
{
    // Get some closed tickets
    // $tickets = \App\Models\Ticket::where('status_id', 5)->limit(10)->get();

    // foreach ($tickets as $ticket) {
    //     \DB::table('feedback')->insert([
    //         'ticket_id'      => $ticket->id,
    //         'responsiveness' => rand(3, 5),
    //         'communication'  => rand(3, 5),
    //         'assurance'      => rand(3, 5),
    //         'reliability'    => rand(3, 5),
    //         'integrity'      => rand(3, 5),
    //         'outcome'        => rand(3, 5),
    //         'created_at'     => now(),
    //     ]);
    // }
}
}
