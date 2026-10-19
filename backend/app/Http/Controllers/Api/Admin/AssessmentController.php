<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Checkpoint dates, and which checkpoint is open for marks.
 */
class AssessmentController extends Controller
{
    public function update(Request $request, Assessment $assessment): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $data = $request->validate([
            'name_ms' => ['sometimes', 'string', 'max:100'],
            'name_en' => ['sometimes', 'string', 'max:100'],
            'exam_date' => ['nullable', 'date_format:Y-m-d'],
            'is_open' => ['sometimes', 'boolean'],
            'is_current' => ['sometimes', 'boolean'],
        ]);
        $old = $assessment->only(array_keys($data));
        DB::transaction(function () use ($assessment, $data) {
            // One current checkpoint per form per year.
            if ($data['is_current'] ?? false) {
                Assessment::where('academic_year_id', $assessment->academic_year_id)
                    ->where('form', $assessment->form)->update(['is_current' => false]);
            }
            $assessment->update($data);
        });
        AuditLog::record('assessment.updated', $assessment, $old, $data);

        return response()->json($assessment);
    }
}
