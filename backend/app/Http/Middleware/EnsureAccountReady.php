<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use App\Models\Consent;
use App\Models\PrivacyNotice;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks the API until the account is usable: still active, the one-time
 * password has been changed, and (for parents) the current privacy notice
 * has been accepted.
 */
class EnsureAccountReady
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user->is_active) {
            Auth::guard('web')->logout();

            return response()->json(['code' => 'account_inactive', 'message' => 'Akaun ini tidak aktif.'], 403);
        }
        if ($user->must_change_password) {
            return response()->json(['code' => 'password_change_required', 'message' => 'Sila tukar kata laluan sementara anda.'], 403);
        }
        if ($user->role === Role::Parent && ($notice = PrivacyNotice::current())) {
            $accepted = Consent::where('user_id', $user->id)->where('privacy_notice_id', $notice->id)->exists();
            if (! $accepted) {
                return response()->json(['code' => 'consent_required', 'message' => 'Sila baca dan terima notis privasi.', 'notice_id' => $notice->id], 403);
            }
        }

        return $next($request);
    }
}
