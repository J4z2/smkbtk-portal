<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Consent;
use App\Models\PrivacyNotice;
use App\Models\User;
use App\Support\Identity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Log in with email, phone or IC number plus password.
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'login' => ['required', 'string', 'max:190'],
            'password' => ['required', 'string', 'max:255'],
        ]);
        $key = 'login:'.Str::lower($data['login']).'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, config('portal.login_max_attempts'))) {
            throw ValidationException::withMessages([
                'login' => 'Terlalu banyak cubaan. Cuba semula dalam '.RateLimiter::availableIn($key).' saat.',
            ])->status(429);
        }

        $user = $this->findUser($data['login'], $data['password']);
        if (! $user || ! $user->is_active) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages(['login' => 'Maklumat log masuk tidak sepadan.']);
        }

        RateLimiter::clear($key);
        Auth::guard('web')->login($user);
        $request->session()->regenerate();
        $user->forceFill(['last_login_at' => now()])->save();
        AuditLog::record('auth.login', $user);

        return response()->json($this->profile($user));
    }

    public function logout(Request $request): JsonResponse
    {
        AuditLog::record('auth.logout', $request->user());
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->profile($request->user()));
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);
        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Kata laluan semasa tidak betul.']);
        }
        if (Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['password' => 'Kata laluan baharu mesti berbeza.']);
        }
        $user->forceFill(['password' => $data['password'], 'must_change_password' => false])->save();
        AuditLog::record('auth.password_changed', $user);

        return response()->json($this->profile($user));
    }

    public function privacyNotice(): JsonResponse
    {
        return response()->json(PrivacyNotice::current());
    }

    public function acceptPrivacyNotice(Request $request): JsonResponse
    {
        $notice = PrivacyNotice::current();
        abort_unless($notice, 404);
        Consent::firstOrCreate(
            ['user_id' => $request->user()->id, 'privacy_notice_id' => $notice->id],
            ['accepted_at' => now(), 'ip_address' => $request->ip()],
        );
        AuditLog::record('consent.accepted', $notice);

        return response()->json(['ok' => true]);
    }

    /**
     * Try every column the identifier could match, then check the password.
     */
    private function findUser(string $login, string $password): ?User
    {
        $candidates = Identity::loginCandidates($login);
        if (! $candidates) {
            return null;
        }
        $users = User::where(function ($q) use ($candidates) {
            foreach ($candidates as $column => $value) {
                $q->orWhere($column, $value);
            }
        })->get();
        if ($users->isEmpty()) {
            // Same work as a real check, so response time does not reveal
            // whether an account exists.
            Hash::check($password, '$2y$12$'.str_repeat('a', 53));

            return null;
        }

        return $users->first(fn (User $u) => Hash::check($password, $u->password));
    }

    /**
     * @return array<string, mixed>
     */
    private function profile(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role->value,
            'locale' => $user->locale,
            'must_change_password' => $user->must_change_password,
        ];
    }
}
