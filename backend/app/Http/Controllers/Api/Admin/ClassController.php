<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\Report;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Classes of the current year, and their class teacher.
 */
class ClassController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $year = AcademicYear::current();
        $data = $this->validated($request, $year);
        $class = SchoolClass::create($data + ['academic_year_id' => $year->id]);
        AuditLog::record('class.created', $class, null, $data);

        return response()->json($class, 201);
    }

    /**
     * Changing the class teacher hands the class (and its records) over;
     * the previous teacher loses access. The audit log keeps who did what.
     */
    public function update(Request $request, SchoolClass $class): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $data = $this->validated($request, $class->academicYear, $class);
        $old = $class->only(array_keys($data));
        $class->update($data);
        AuditLog::record('class.updated', $class, $old, $data);

        return response()->json($class);
    }

    public function destroy(Request $request, SchoolClass $class): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        abort_if($class->enrolments()->exists() || Report::where('class_id', $class->id)->exists(), 422, 'Kelas ini mempunyai pelajar atau laporan dan tidak boleh dipadam.');
        AuditLog::record('class.deleted', $class, $class->toArray());
        $class->delete();

        return response()->json(['ok' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, AcademicYear $year, ?SchoolClass $class = null): array
    {
        $creating = $class === null;
        $data = $request->validate([
            'code' => [$creating ? 'required' : 'sometimes', 'string', 'max:32', 'regex:/^[A-Za-z0-9_-]+$/',
                Rule::unique('classes', 'code')->where('academic_year_id', $year->id)->ignore($class)],
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:60'],
            'form' => [$creating ? 'required' : 'sometimes', 'integer', 'between:1,6'],
            'form6_stage' => ['nullable', Rule::in(['bawah', 'atas'])],
            'session' => ['sometimes', Rule::in(['pagi', 'petang'])],
            'is_dlp' => ['sometimes', 'boolean'],
            'class_teacher_id' => ['nullable', 'integer',
                Rule::unique('classes', 'class_teacher_id')->where('academic_year_id', $year->id)->ignore($class)],
        ], ['class_teacher_id.unique' => 'Guru ini sudah menjadi guru kelas bagi kelas lain.']);
        if (! empty($data['class_teacher_id'])) {
            abort_unless(User::whereKey($data['class_teacher_id'])->where('role', Role::ClassTeacher)->exists(), 422, 'Guru kelas mesti akaun berperanan guru kelas.');
        }

        return $data;
    }
}
