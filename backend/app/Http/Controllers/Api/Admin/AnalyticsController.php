<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Mark;
use App\Services\Coex;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Grade breakdown per form for one subject and checkpoint key.
 * Admins see the whole school; class teachers see their own class.
 */
class AnalyticsController extends Controller
{
    private const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'G'];

    public function grades(Request $request, Coex $coex): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->role->isStaff(), 403);
        $data = $request->validate([
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'assessment_key' => ['required', 'string', 'max:20'],
            'form' => ['nullable', 'integer', 'between:1,6'],
        ]);
        $year = AcademicYear::current();
        $marks = Mark::query()
            ->join('reports', 'reports.id', '=', 'marks.report_id')
            ->join('assessments', 'assessments.id', '=', 'reports.assessment_id')
            ->join('classes', 'classes.id', '=', 'reports.class_id')
            ->where('assessments.academic_year_id', $year?->id)
            ->where('assessments.key', $data['assessment_key'])
            ->where('marks.subject_id', $data['subject_id'])
            ->whereNotNull('marks.mark')
            ->when($data['form'] ?? null, fn ($q, $f) => $q->where('classes.form', $f))
            ->when(! $user->isAdmin(), fn ($q) => $q->whereIn('reports.class_id', Access::taughtClassIds($user)))
            ->get(['marks.mark', 'classes.form']);

        $summarise = function ($rows) use ($coex) {
            $counts = array_fill_keys(self::GRADES, 0);
            foreach ($rows as $r) {
                $counts[$coex->gradeFor($r->mark)]++;
            }

            return ['students' => $rows->count(), 'average' => Coex::average($rows->pluck('mark')->all()), 'grades' => $counts];
        };

        return response()->json([
            'overall' => $summarise($marks),
            'by_form' => $marks->groupBy('form')->sortKeys()->map($summarise),
        ]);
    }
}
