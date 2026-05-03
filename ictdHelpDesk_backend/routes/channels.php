<?php

use App\Models\Ticket;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['sanctum']]);

Broadcast::channel('management-assignment-request-update', function ($user) {
    return (int) $user->account_role_id === 3;
}, ['guards' => ['sanctum']]);

Broadcast::channel('user-recently-viewed-tickets.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
}, ['guards' => ['sanctum']]);

Broadcast::channel('ticket.{ticketId}.remarks', function ($user, $ticketId) {
    $ticket = Ticket::withTrashed()->find($ticketId);

    return $user->id === $ticket->requester_id
        || $ticket->responder()->where('user_id', $user->id)->exists()
        || in_array($user->account_role_id, [1, 2, 3]);

}, ['guards' => ['sanctum']]);

Broadcast::channel('realtime-channel-{role}-{userId}', function ($user, $role, $userId) {
    return (int) $user->id === (int) $userId && str_replace(' ', '', $user->account_role->name) === $role;
}, ['guards' => ['sanctum']]);



// Channels for the dashboard
Broadcast::channel('dashboard-manager-realtime', function ($user) {
    return in_array($user->account_role_id, [1, 2, 3]);
}, ['guards' => ['sanctum']]);
