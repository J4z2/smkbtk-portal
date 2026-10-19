<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $data = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'action' => ['nullable', 'string', 'max:100'],
        ]);
        $logs = AuditLog::with('user:id,name,role')
            ->when($data['action'] ?? null, fn ($q, $a) => $q->where('action', 'like', "{$a}%"))
            ->when($data['q'] ?? null, fn ($q, $t) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$t}%")))
            ->latest('created_at')->latest('id')
            ->paginate(50);

        return response()->json($logs);
    }
}
