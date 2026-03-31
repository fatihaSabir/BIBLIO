<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        if (!$user)                        return response()->json(['message'=>'Non authentifie.'], 401);
        if (!in_array($user->role,$roles)) return response()->json(['message'=>'Acces refuse.'], 403);
        if (!$user->is_active)             return response()->json(['message'=>'Compte desactive.'], 403);
        return $next($request);
    }
}
