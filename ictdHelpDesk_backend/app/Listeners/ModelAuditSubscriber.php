<?php

namespace App\Listeners;


use App\Models\Audit;
use Illuminate\Support\Facades\Auth;

class ModelAuditSubscriber
{
    /**
     * Handle the Eloquent event.
     * Laravel passes the model instance as the only argument here.
     */
    public function handleAudit($model)
    {
        // 1. Determine the event name dynamically
        // Since we are inside a specific listener, we can check the model's state
        $eventName = 'updated';
        if (!$model->exists) {
            $eventName = 'deleted';
        } elseif ($model->wasRecentlyCreated) {
            $eventName = 'created';
        }

        // 2. Define fields to ignore
        $ignore = ['password', 'remember_token', 'updated_at', 'created_at'];

        // 3. Get clean values
        $oldValues = array_diff_key($model->getOriginal(), array_flip($ignore));
        $newValues = array_diff_key($model->getAttributes(), array_flip($ignore));
        $auditableId = $model->ticketId
               ?? $model->employeeID
               ?? $model->getKey();

        // 4. Create the Audit record
        Audit::create([
            'event'          => $eventName,
            'auditable_type' => get_class($model),
            'auditable_id'   => $auditableId,
            'user_id'        => Auth::id(),
            'old_values'     => $eventName !== 'created' ? $oldValues : null,
            'new_values'     => $eventName !== 'deleted' ? $newValues : null,
        ]);
    }

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe($events): void
    {
        $targets = [
            \App\Models\User::class,
            \App\Models\Ticket::class,
        ];

        foreach ($targets as $model) {
            // We point all events to the same handleAudit method
            $events->listen("eloquent.created: {$model}", [self::class, 'handleAudit']);
            $events->listen("eloquent.updated: {$model}", [self::class, 'handleAudit']);
            $events->listen("eloquent.deleted: {$model}", [self::class, 'handleAudit']);
        }
    }
}
