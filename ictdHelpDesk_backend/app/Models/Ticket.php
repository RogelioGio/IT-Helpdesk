<?php

namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Auth;

class Ticket extends Model
    {
        use softDeletes,Searchable;
        protected $table = "ticket";


        public const STATUS_HIERARCHY = [
        'Open'      => 1,
        'Assigned'  => 2,
        'Responded' => 3,
        'Resolved'  => 4,
        'Closed'    => 5,
        'Cancelled' => 6,
    ];

    protected $casts = [
        'assignementDate' => 'datetime',
        'respondedDate'  => 'datetime',
        'dateClosed'     => 'datetime',
    ];

    protected $fillable = [
        'ticketId',
        'activity_id',
        'activitySpecification_id',
        'assetSerialNumber',
        'status_id',
        'priority_id',
        'responder_id',
        'requester_id',
        'assignementDate',
        'findings',
        'resolution',
        'dateClosed',
        'description',
    'cancellation_reason',
        // Add migration and create an descriptions
    ];

    public function toSearchableArray(): array {
        return
        [
            'ticketId' => $this->ticketId,
            'created_at' => $this->created_at ? $this->created_at->timestamp : null,

            //Relations
            'activity' => $this->activity ? $this->activity->name : null,
            'activitySpecification' => $this->activitySpecification ? $this->activitySpecification->name : null,
            'status' => $this->status ? $this->status->name : null,
            'priority' => $this->priority ? $this->priority->name : null,

            //Filtering
            'activity_id' => $this->activity_id,
            'activitySpecification_id' => $this->activitySpecification_id,
            'status_id' => $this->status_id,
            'priority_id' => $this->priority_id,
        ];
    }

// protected static function booted()
// {
//     static::updating(function ($ticket) {
//         if ($ticket->isDirty('status_id')) {
//             $oldStatusName = \App\Models\TicketStatus::getNameById($ticket->getOriginal('status_id'));
//             $newStatusName = \App\Models\TicketStatus::getNameById($ticket->status_id);

//             $hierarchy = self::STATUS_HIERARCHY;

//             if (isset($hierarchy[$oldStatusName], $hierarchy[$newStatusName])) {
//                 $oldRank = $hierarchy[$oldStatusName];
//                 $newRank = $hierarchy[$newStatusName];

//                 // 1. Logic for User Cancellation
//                 if ($newStatusName === 'Cancelled') {
//                     // Rule: Cannot cancel if the work is already finished (Closed)
//                     if ($oldStatusName === 'Closed') {
//                          throw ValidationException::withMessages([
//                             'status_id' => ["You cannot cancel a ticket that is already Closed."]
//                         ]);
//                     }

//                     // TESTING MODE: Auth check is commented out so you can test in Postman easily
//                     /*
//                     $user = Auth::user();
//                     if (!$user || (int)$user->id !== (int)$ticket->requester_id) {
//                         throw ValidationException::withMessages([
//                             'status_id' => ["Only the requester can cancel this ticket."]
//                         ]);
//                     }
//                     */

//                     return; // Allow the user to cancel
//                 }

//                 // 2. Backward Movement (Officer/Admin Logic)
//                 if ($newRank < $oldRank) {
//                     // For testing, we allow this, but usually, this is for Managers only
//                     return;
//                 }
//             }
//         }
//     });
// }


    public function canBeCancelled(): bool
    {
        return $this->status->name !== 'Closed';
    }

    public function cancel()
    {
        if (!$this->canBeCancelled()) {
            throw new \Exception("Closed tickets cannot be cancelled.");
        }

        // Use your cached helper for better performance
        $cancelledStatus = \App\Models\TicketStatus::where('name', 'Cancelled')->first();

        return $this->update([
            'status_id'           => $cancelledStatus->id,
            'cancellation_reason' => $reason ?? 'No reason provided.',
            // We no longer need to mess with the 'findings' column!
        ]);
    }

// public function toSearchableArray(): array
// {
//     // ONLY include real columns from the 'ticket' table.
//     return [
//         'id'                => (int) $this->id,
//         'ticketId'          => $this->ticketId,
//         'description'       => $this->description,
//         'assetSerialNumber' => $this->assetSerialNumber,
//     ];
// }
    public function scopeRoleFilter($query)
    {
        $user = Auth::user();

        return match ($user->account_role_id) {
            1, 2, 3 => $query,
            4       => $query->whereHas('responder', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    }),
            5       => $query->where('requester_id', $user->id),
            default => $query->whereNull('id'),
        };
    }
    public function timeline()
    {
        return $this->belongsToMany(TicketStatus::class, 'tickettimeline', 'ticket_id', 'status_id')
                    ->using(TicketTimeline::class)
                    ->withTimestamps()
                    ->withPivot('user_id');
    }
    public function activity(){
        return $this->belongsTo(Activity::class, 'activity_id', 'id');
    }

    public function activitySpecification(){
        return $this->belongsTo(ActivitySpecifications::class, 'activitySpecification_id', 'id');
    }

    public function status(){
        return $this->belongsTo(TicketStatus::class, 'status_id', 'id');
    }

    public function priority(){
        return $this->belongsTo(TicketRelevance::class, 'priority_id', 'id');
    }

    public function responder(){
        return $this->belongsToMany(User::class, 'ticketassignment', 'ticket_id', 'user_id')->withTimestamps()->select('users.*');
    }

    public function requester(){
        return $this->belongsTo(User::class, 'requester_id', 'id');
    }

    public function audits(): MorphMany
    {
        return $this->morphMany(Audit::class, 'auditable');
    }


    public function recentTicket(){
        return $this->belongsTo(RecentTickets::class, 'ticket_id', 'id');
    }

    public function feedback(){
        return $this->hasOne(Feedback::class);
    }

    public function cancellation()
    {
        // A ticket has one cancellation record
        return $this->hasOne(Cancellation::class, 'ticket_id');
    }

    public function requests() {
        return $this->hasMany(RequestAssignment::class, 'ticket_id');
    }

public function cancelReasons(): BelongsToMany
    {
        return $this->belongsToMany(CancelReason::class, 'cancellations', 'ticket_id', 'cancel_reason_id')
                    ->withPivot('custom_reason')
                    ->withTimestamps();
    }
public function AssignedTickets()
{
    return $this->belongsToMany(Ticket::class, 'ticketassignment', 'user_id', 'ticket_id')
        ->using(RequestAssignment::class) // Tells Laravel to use your custom Pivot model
        ->withPivot('id', 'deleted_at')   // Access pivot specific columns
        ->withTimestamps();
}


public function latestStatus()
{
    return $this->hasOne(TicketTimeline::class, 'ticket_id')->latestOfMany('created_at');
}

public function remarks()
{
    return $this->morphMany(Remark::class, 'remarkable');

}

}


