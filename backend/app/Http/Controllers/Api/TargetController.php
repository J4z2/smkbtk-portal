<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\Student;
use App\Models\Target;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * Subject targets for the current year: the class teacher or an admin.
 */
class TargetController extends Controller
{
    public function update(Request $request, Student $student): JsonResponse
    {
        abort_unless($request->user()->role->isStaff(), 403);
        Gate::authorize('view', $student);
        $data = $request->validate([
            'targets' => ['required', 'array'],
            'targets.*.subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'targets.*.target_mark' => ['nullable', 'integer', 'between:0,100'],
        ]);
        $year = AcademicYear::current();
        foreach ($data['targets'] as $row) {
            $key = ['student_id' => $student->id, 'academic_year_id' => $year->id, 'subject_id' => $row['subject_id']];
            $row['target_mark'] === null
                ? Target::where($key)->delete()
                : Target::updateOrCreate($key, ['target_mark' => $row['target_mark'], 'set_by' => $request->user()->id]);
        }
        AuditLog::record('targets.updated', $student, null, $data);

        return response()->json(['ok' => true]);
    }
}
