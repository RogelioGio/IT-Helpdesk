<?php

namespace App\Http\Controllers;

use App\Models\AccountRoles;
use Illuminate\Http\Request;

class AccountRoleController extends Controller
{


    /**
     * 
     * 
     * Display a listing of the static roles.
     */
    public function index()
    {
        // Returning the collection directly
        return response()->json(AccountRoles::all());
    }

    /**
     * Display the specified static role.
     */
    public function show($id)
    {
        // Using findOrFail so it automatically returns a 404 if the ID is wrong
        $role = AccountRoles::findOrFail($id);
        
        return response()->json($role);
    } 
}   