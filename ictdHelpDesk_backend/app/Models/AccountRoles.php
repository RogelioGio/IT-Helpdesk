<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountRoles extends Model
{

    public $touches = ['users'];

    use HasFactory;
    protected $table = "accountroles";

    protected $fillable = [
        'name',
        'description',

    ];

    protected static function newFactory()
    {
        return \Database\Factories\AccountRolesFactory::new();
    }

    public function users() {
        return $this->hasMany(User::class, 'account_role_id', 'id');
    }

}
