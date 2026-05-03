<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;

class Office_Department_Division extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $touches = ['users'];


    protected $table = "office_department_division";

    protected $fillable = [
        'officeCode',
        'name',
        'description',
    ];

    protected static function newFactory()
    {
        return \Database\Factories\Office_Department_DivisionFactory::new();
    }

    public function users()
    {
        return $this->hasMany(User::class, 'office_department_division_id', 'id');
    }

    public function audits(): MorphMany
    {
        return $this->morphMany(Audit::class, 'auditable');
    }

    public function toSearchableArray(): array
{
    return [
        'id'          => (int) $this->id,
        'officeCode'  => $this->officeCode,
        'name'        => $this->name,
        'description' => $this->description,
    ];
}

//Though Relationships
public function tickets(){
    return $this->hasManyThrough(Ticket::class , User::class, "office_department_division_id", "requester_id", "id", "id");
}

}

