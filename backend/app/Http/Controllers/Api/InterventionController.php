<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Intervention;
use App\Models\Student;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * Follow-up actions for students who need support. Staff only.
 */
class InterventionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->role->isStaff(), 403);
        $ids = Access::students($request->user())->select('students.id');

        return response()->json(
            Intervention::whereIn('student_id', $ids)
                ->with(['student:id,name,student_no', 'subject:id,code,name_ms'])
                ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
                ->latest()->limit(500)->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()->role->isStaff(), 403);
        $data = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
            'type' => ['required', 'string', 'max:60'],
            'follow_up_on' => ['nullable', 'date_format:Y-m-d'],
            'note' => ['required', 'string', 'max:2000'],
        ]);
        Gate::authorize('view', Student::findOrFail($data['student_id']));
        $intervention = Intervention::create($data + ['owner_id' => $request->user()->id, 'created_by' => $request->user()->id]);
        AuditLog::record('intervention.created', $intervention);

        return response()->json($intervention, 201);
    }

    public function resolve(Request $request, Intervention $intervention): JsonResponse
    {
        abort_unless($request->user()->role->isStaff(), 403);
        Gate::authorize('view', $intervention->student);
        $intervention->update(['status' => 'resolved', 'resolved_at' => now()]);
        AuditLog::record('intervention.resolved', $intervention);

        return response()->json($intervention);
    }
}
