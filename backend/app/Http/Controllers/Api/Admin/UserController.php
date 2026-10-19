<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\OneTimePassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Staff accounts. Admins manage class teachers; only the super admin
 * creates or changes admins and super admins.
 */
class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $data = $request->validate(['role' => ['nullable', Rule::enum(Role::class)], 'q' => ['nullable', 'string', 'max:100']]);
        $users = User::query()
            ->when($data['role'] ?? null, fn ($q, $r) => $q->where('role', $r), fn ($q) => $q->where('role', '!=', Role::Parent))
            ->when($data['q'] ?? null, fn ($q, $t) => $q->where('name', 'like', "%{$t}%"))
            ->with('classes:id,name,class_teacher_id,academic_year_id')
            ->orderBy('name')
            ->paginate(100);

        return response()->json($users->through(fn (User $u) => [
            'id' => $u->id, 'name' => $u->name, 'role' => $u->role->value, 'email' => $u->email,
            'phone' => $u->phone, 'is_active' => $u->is_active, 'last_login_at' => $u->last_login_at?->toIso8601String(),
            'classes' => $u->classes->map->only(['id', 'name']),
        ]));
    }

    /**
     * Create a staff account. Returns a one-time password to hand over.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'role' => ['required', Rule::in([Role::ClassTeacher->value, Role::Admin->value, Role::SuperAdmin->value])],
            'email' => ['nullable', 'email', 'max:190', 'unique:users,email', 'required_without_all:phone,ic'],
            'phone' => ['nullable', 'string', 'max:20'],
            'ic' => ['nullable', 'string', 'max:20'],
        ]);
        $this->authorizeRole($request, Role::from($data['role']));
        $password = OneTimePassword::generate();
        $user = new User(['name' => $data['name'], 'role' => $data['role'], 'email' => isset($data['email']) ? strtolower($data['email']) : null, 'password' => $password]);
        $user->setPhone($data['phone'] ?? null)->setIc($data['ic'] ?? null);
        $this->ensureUniqueIdentifiers($user);
        $user->must_change_password = true;
        $user->save();
        AuditLog::record('user.created', $user, null, ['name' => $user->name, 'role' => $user->role->value]);

        return response()->json(['id' => $user->id, 'one_time_password' => $password], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        abort_if($user->role === Role::Parent, 404);
        $this->authorizeRole($request, $user->role);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'role' => ['sometimes', Rule::in([Role::ClassTeacher->value, Role::Admin->value, Role::SuperAdmin->value])],
            'is_active' => ['sometimes', 'boolean'],
        ]);
        if (isset($data['role'])) {
            $this->authorizeRole($request, Role::from($data['role']));
        }
        abort_if($user->is($request->user()) && (($data['is_active'] ?? true) === false || isset($data['role'])), 422, 'Anda tidak boleh menukar peranan atau menyahaktifkan akaun sendiri.');
        $old = $user->only(array_keys($data));
        $user->update($data);
        AuditLog::record('user.updated', $user, $old, $data);

        return response()->json(['ok' => true]);
    }

    /**
     * Staff password reset: a new one-time password the user must change.
     */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        abort_if($user->role === Role::Parent, 404);
        $this->authorizeRole($request, $user->role);
        $password = OneTimePassword::generate();
        $user->forceFill(['password' => $password, 'must_change_password' => true])->save();
        AuditLog::record('user.password_reset', $user);

        return response()->json(['one_time_password' => $password]);
    }

    private function authorizeRole(Request $request, Role $target): void
    {
        $me = $request->user()->role;
        $allowed = $me === Role::SuperAdmin || ($me === Role::Admin && $target === Role::ClassTeacher);
        abort_unless($allowed, 403);
    }

    private function ensureUniqueIdentifiers(User $user): void
    {
        foreach (['phone', 'ic_hash'] as $column) {
            if ($user->{$column} && User::withTrashed()->where($column, $user->{$column})->exists()) {
                abort(422, $column === 'phone' ? 'Nombor telefon ini telah digunakan.' : 'Nombor IC ini telah digunakan.');
            }
        }
    }
}
