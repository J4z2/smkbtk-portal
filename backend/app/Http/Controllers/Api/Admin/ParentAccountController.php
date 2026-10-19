<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Guardian;
use App\Models\SchoolClass;
use App\Models\User;
use App\Support\Access;
use App\Support\OneTimePassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Parent logins. There is no email at launch, so accounts are handed out
 * on printed slips with a one-time password. Admins can do any class; a
 * class teacher can do their own class.
 */
class ParentAccountController extends Controller
{
    /**
     * Create logins for every guardian in a class who has none yet, and
     * return the slips to print. Existing logins are not changed.
     */
    public function createForClass(Request $request, SchoolClass $class): JsonResponse
    {
        abort_unless(Access::canManageClass($request->user(), $class), 403);
        $guardians = Guardian::whereNull('user_id')
            ->whereHas('students.enrolments', fn ($e) => $e->where('is_current', true)->where('class_id', $class->id))
            ->with('students:id,name')
            ->get();
        $slips = DB::transaction(fn () => $guardians->map(fn (Guardian $g) => $this->createLogin($g))->filter()->values());

        return response()->json(['created' => $slips->count(), 'slips' => $slips]);
    }

    /**
     * New one-time password for one guardian (creates the login if needed).
     */
    public function reset(Request $request, Guardian $guardian): JsonResponse
    {
        $user = $request->user();
        $allowed = $user->isAdmin() || $guardian->students()->get()->contains(fn ($s) => Access::canSeeStudent($user, $s));
        abort_unless($allowed && $user->role->isStaff(), 403);
        if (! $guardian->user) {
            $slip = DB::transaction(fn () => $this->createLogin($guardian));
            abort_unless($slip, 422, 'Penjaga tiada IC, telefon atau e-mel untuk dijadikan nama pengguna.');

            return response()->json($slip);
        }
        $password = OneTimePassword::generate();
        $guardian->user->forceFill(['password' => $password, 'must_change_password' => true])->save();
        AuditLog::record('parent.password_reset', $guardian->user);

        return response()->json($this->slip($guardian, $guardian->user, $password));
    }

    /**
     * @return array<string, mixed>|null
     */
    private function createLogin(Guardian $guardian): ?array
    {
        $ic = $guardian->ic_encrypted;
        if (! $ic && ! $guardian->phone && ! $guardian->email) {
            return null;
        }
        $password = OneTimePassword::generate();
        $user = new User([
            'name' => $guardian->name,
            'role' => Role::Parent,
            'password' => $password,
            'must_change_password' => true,
        ]);
        // Each identifier is used only if no other account has it.
        if ($guardian->email && ! User::withTrashed()->where('email', strtolower($guardian->email))->exists()) {
            $user->email = strtolower($guardian->email);
        }
        if ($guardian->phone && ! User::withTrashed()->where('phone', $guardian->phone)->exists()) {
            $user->phone = $guardian->phone;
        }
        if ($ic && ! User::withTrashed()->where('ic_hash', $guardian->ic_hash)->exists()) {
            $user->setIc($ic);
        }
        if (! $user->email && ! $user->phone && ! $user->ic_hash) {
            return null;
        }
        $user->save();
        $guardian->user()->associate($user)->save();
        AuditLog::record('parent.account_created', $user);

        return $this->slip($guardian, $user, $password);
    }

    /**
     * @return array<string, mixed>
     */
    private function slip(Guardian $guardian, User $user, string $password): array
    {
        return [
            'guardian_id' => $guardian->id,
            'guardian' => $guardian->name,
            'students' => $guardian->students->pluck('name'),
            // What to type at login: IC first, then phone, then email.
            'username' => $user->ic_encrypted ?? $user->phone ?? $user->email,
            'one_time_password' => $password,
        ];
    }
}
