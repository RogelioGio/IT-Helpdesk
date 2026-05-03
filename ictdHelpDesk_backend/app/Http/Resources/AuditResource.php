<?php


namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Check if the user exists, otherwise default to System
        $user = $this->user;
        $userName = $user ? trim($user->firstName . ' ' . $user->lastName) : 'System/Deleted User';
        $userRole = $user->account_role->name ?? 'N/A';

        return [
            'id'           => $this->id,
            'event'        => strtoupper($this->event),
            'message'      => $this->message, // Uses your Model accessor
            'target'       => str_replace('App\\Models\\', '', $this->auditable_type),
            'target_id'    => $this->auditable_id,
            
            'performed_by' => [
                'name' => $userName,
                'role' => $userRole,
            ],

            'changes' => [
                // Only show 'before' if it's NOT a creation event
                'before'  => $this->when(strtolower($this->event) !== 'created', $this->old_values),
                'after'   => $this->new_values,
                'summary' => $this->diff, // Uses your Model 'diff' accessor
            ],

            'timestamp'    => $this->created_at->format('M d, Y h:i A'),
            'relative'     => $this->created_at->diffForHumans(),
        ];
    }
}