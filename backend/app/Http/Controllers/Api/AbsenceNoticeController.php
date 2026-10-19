<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AbsenceNotice;
use App\Models\AuditLog;
use App\Models\Student;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AbsenceNoticeController extends Controller
{
    /**
     * Notices for students the user may see; staff see pending ones first.
     */
    public function index(Request $request): JsonResponse
    {
        $ids = Access::students($request->user())->select('students.id');
        $notices = AbsenceNotice::whereIn('student_id', $ids)
            ->with('student:id,name,student_no')
            ->orderByRaw("CASE WHEN status = 'submitted' THEN 0 ELSE 1 END")
            ->latest()
            ->limit(200)
            ->get();

        return response()->json($notices);
    }

    /**
     * A parent tells the school about an absence.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'date_from' => ['required', 'date_format:Y-m-d'],
            'date_to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:date_from'],
            'reason' => ['required', Rule::in(['keluarga', 'kesihatan', 'mc', 'lain'])],
            'note' => ['nullable', 'string', 'max:1000'],
            'document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:4096'],
        ]);
        $student = Student::findOrFail($data['student_id']);
        abort_unless($request->user()->role === Role::Parent, 403);
        Gate::authorize('view', $student);

        $notice = AbsenceNotice::create([
            'student_id' => $student->id,
            'submitted_by' => $request->user()->id,
            'date_from' => $data['date_from'],
            'date_to' => $data['date_to'] ?? $data['date_from'],
            'reason' => $data['reason'],
            'note' => $data['note'] ?? null,
            'document_path' => $request->file('document')?->store('absence-documents', 'local'),
        ]);
        AuditLog::record('absence_notice.created', $notice);

        return response()->json($notice, 201);
    }

    public function review(Request $request, AbsenceNotice $notice): JsonResponse
    {
        abort_unless($request->user()->role->isStaff(), 403);
        Gate::authorize('view', $notice->student);
        $data = $request->validate(['status' => ['required', Rule::in(['acknowledged', 'rejected'])]]);
        $notice->update(['status' => $data['status'], 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);
        AuditLog::record('absence_notice.reviewed', $notice, null, $data);

        return response()->json($notice);
    }
}
