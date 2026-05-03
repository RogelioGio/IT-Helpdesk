<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
{
    $query = $request->get('query');

    // If the query is empty, return nothing or recent items
    if (empty($query)) {
        return response()->json(['tickets' => [], 'users' => []]);
    }

    $users = User::search($query)
        ->where('status', 'active') // Example of adding constraints
        ->take(10)
        ->get();

    $tickets = Ticket::search($query)
        ->take(10)
        ->get();

    return response()->json([
        'tickets' => $tickets,
        'users'   => $users,
    ]);
}
}