<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            "username" => "required|string",
            "password" => "required|string",
        ]);

        if(!Auth::attempt($request->only("username", "password"))){
            return response()->json([
                "message" => "Invalid username or password"
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            "message"=> "Login Successfully",
            "user" => Auth::user()
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard("web")->logout();       
        $request->session()->flush();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            "message" => "Logout successful"
        ], 200);
    }

    
}

