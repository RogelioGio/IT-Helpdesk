<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    
     
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        
        $userRole = $request->query('role'); 

      
        if (!in_array($userRole, $roles)) {
          
            abort(403, 'Access denied. You do not have the correct role.');
        }

   
        return $next($request);
    }
}