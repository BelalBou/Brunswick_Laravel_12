<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->type !== 'administrator') {
            return response()->json(['error' => 'Unauthorized. Administrator access required.'], 403);
        }

        return $next($request);
    }
} 