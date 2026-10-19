<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The portal sends X-Locale (ms or en) so validation messages come back in
 * the language the user picked.
 */
class SetLocaleFromHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('X-Locale');
        if (in_array($locale, ['ms', 'en'], true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
