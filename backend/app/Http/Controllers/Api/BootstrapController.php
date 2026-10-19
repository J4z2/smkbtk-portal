<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\SchoolClass;
use App\Models\Setting;
use App\Models\Subject;
use App\Services\Coex;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Data every screen needs after login: school details, COEx rules,
 * subjects, the current year's checkpoints and (for staff) classes.
 */
class BootstrapController extends Controller
{
    public function __invoke(Request $request, Coex $coex): JsonResponse
    {
        $user = $request->user();
        $year = AcademicYear::current();
        $classes = SchoolClass::query()
            ->where('academic_year_id', $year?->id)
            ->when(! $user->isAdmin(), fn ($q) => $q->whereIn('id', Access::taughtClassIds($user)))
            ->with('classTeacher:id,name')
            ->withCount('students')
            ->orderBy('form')->orderBy('name')
            ->get();

        return response()->json([
            'user' => ['id' => $user->id, 'name' => $user->name, 'role' => $user->role->value, 'locale' => $user->locale],
            'school' => [
                'name' => Setting::get('school.name', 'SMK Bandar Tasik Kesuma'),
                'address' => Setting::get('school.address', ''),
                'phone' => Setting::get('school.phone', ''),
                'email' => Setting::get('school.email', ''),
                'office_hours' => Setting::get('school.office_hours', ''),
            ],
            'year' => $year?->only(['id', 'year', 'starts_on', 'ends_on']),
            'coex' => [
                'lms_pass_mark' => (int) Setting::get('coex.lms_pass_mark', 40),
                'credit_gear' => (int) Setting::get('coex.credit_gear', 5),
                'purple_gear' => (int) Setting::get('coex.purple_gear', 10),
                'rules' => $coex->rules()->map->only(['gear', 'min_mark', 'max_mark', 'grade', 'zone', 'level', 'action_ms', 'action_en', 'color'])->values(),
            ],
            'subjects' => Subject::where('is_active', true)->orderBy('name_ms')->get(['id', 'code', 'name_ms', 'name_en']),
            'assessments' => Assessment::where('academic_year_id', $year?->id)
                ->orderBy('form')->orderBy('sort_order')
                ->get(['id', 'form', 'key', 'name_ms', 'name_en', 'exam_date', 'is_current', 'is_open']),
            'classes' => $user->role->isStaff() ? $classes->map(fn ($c) => [
                'id' => $c->id, 'name' => $c->name, 'code' => $c->code, 'form' => $c->form,
                'form6_stage' => $c->form6_stage, 'is_dlp' => $c->is_dlp, 'session' => $c->session,
                'class_teacher' => $c->classTeacher?->only(['id', 'name']),
                'students_count' => $c->students_count,
            ]) : [],
        ]);
    }
}
