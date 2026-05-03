<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

class User extends Authenticatable
{

    use HasApiTokens, Notifiable, HasFactory, SoftDeletes,Searchable;


    protected $fillable = [
        'employeeID',
        'firstName',
        'lastName',
        'middleName',
        'email',
        'password',
        'username',
        'designation',
        'office_department_division_id',
        'account_role_id',
    ];
protected $hidden = [
    'password',
    'remember_token',
];

public function toSearchableArray(): array
{
    return [
        'employeeID' => (string) $this->employeeID,
        'firstName'   => $this->firstName,
        'middleName' => $this->middleName,
        'lastName'    => $this->lastName,
        'email'       => $this->email,
        'username'    => $this->username,
        'designation' => $this->designation,

        // Relations
        'office_department_division' => $this->office_department_division ? $this->office_department_division->name : null,
        'account_role' => $this->account_role ? $this->account_role->name : null,

        // ID relations for filtering
        'office_department_division_id' => $this->office_department_division_id,
        'account_role_id' => $this->account_role_id,
    ];
}

    public function AssignedTickets(){
        return $this->belongsToMany(Ticket::class, 'ticketassignment', 'user_id', 'ticket_id');
    }


    public function office_department_division(){
        return $this->belongsTo(Office_Department_Division::class, 'office_department_division_id', 'id');
    }

    public function account_role(){
        return $this->belongsTo(AccountRoles::class, 'account_role_id', 'id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'requester_id', 'id');
    }

/**
 * Helper to get only the 5 most recent
 */
public function recentTickets()
{
    return $this->hasMany(Ticket::class)->latest()->limit(5);
}
public function pendingRequests()
{
    return $this->hasMany(RequestAssignment::class, 'user_id');
}

public function notifications()
{
    return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();
}

public function audit(){
    return $this->hasMany(Audit::class, 'user_id');
}
}
