<?php

namespace App\Http\Controllers\Api;

use App\Enums\ReportStatus;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Models\Assessment;
use App\Models\AuditLog;
use App\Models\Report;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Services\ReportBook;
use App\Services\ReportWorkflow;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use InvalidArgumentException;

class ReportController extends Controller
{
    private const WITH = ['marks.subject', 'assessment.academicYear'];

    public function __construct(private ReportWorkflow $workflow, private ReportBook $book) {}

    /**
     * A class's reports for one assessment. Creates missing report rows.
     */
    public function forClass(Request $request, SchoolClass $class): AnonymousResourceCollection
    {
        abort_unless(Access::canManageClass($request->user(), $class), 403);
        $data = $request->validate(['assessment_id' => ['required', 'integer']]);
        $assessment = Assessment::where('form', $class->form)
            ->where('academic_year_id', $class->academic_year_id)
            ->findOrFail($data['assessment_id']);
        $this->book->forClass($class, $assessment);

        $reports = Report::where('class_id', $class->id)->where('assessment_id', $assessment->id)
            ->with(self::WITH)->get();

        return ReportResource::collection($reports);
    }

    /**
     * All reports of one student the user may see (parents: published only).
     */
    public function forStudent(Request $request, Student $student): AnonymousResourceCollection
    {
        Gate::authorize('view', $student);
        $reports = $student->reports()
            ->when($request->user()->role === Role::Parent, fn ($q) => $q->where('status', ReportStatus::Published))
            ->with(self::WITH)
            ->get()
            ->sortBy(fn (Report $r) => [$r->assessment->academicYear->year, $r->assessment->sort_order])
            ->values();

        return ReportResource::collection($reports);
    }

    public function show(Report $report): ReportResource
    {
        Gate::authorize('view', $report);

        return new ReportResource($report->load(self::WITH));
    }

    /**
     * Save marks and comments. A blank mark is stored as "not entered".
     */
    public function update(Request $request, Report $report): ReportResource
    {
        Gate::authorize('update', $report);
        $data = $request->validate([
            'marks' => ['sometimes', 'array'],
            'marks.*.subject_id' => ['required', 'integer'],
            'marks.*.mark' => ['nullable', 'integer', 'between:0,100'],
            'marks.*.is_absent' => ['sometimes', 'boolean'],
            'teacher_comment' => ['nullable', 'string', 'max:2000'],
            'support_note' => ['nullable', 'string', 'max:2000'],
            'discipline_note' => ['nullable', 'string', 'max:1000'],
            'co_score' => ['nullable', 'integer', 'between:0,100'],
        ]);
        $known = $report->marks()->pluck('subject_id')->all();
        foreach ($data['marks'] ?? [] as $row) {
            abort_unless(in_array($row['subject_id'], $known, true), 422, 'Subjek tiada dalam laporan ini.');
        }
        DB::transaction(function () use ($report, $data, $request) {
            $old = [];
            foreach ($data['marks'] ?? [] as $row) {
                $mark = $report->marks()->where('subject_id', $row['subject_id'])->first();
                $old[$mark->subject_id] = $mark->mark;
                $mark->fill([
                    'mark' => ($row['is_absent'] ?? false) ? null : ($row['mark'] ?? null),
                    'is_absent' => $row['is_absent'] ?? false,
                    'entered_by' => $request->user()->id,
                ])->save();
            }
            $report->fill(collect($data)->except('marks')->all())->save();
            AuditLog::record('report.updated', $report, ['marks' => $old], collect($data)->all());
        });

        return new ReportResource($report->fresh(self::WITH));
    }

    public function submit(Request $request, Report $report): ReportResource
    {
        Gate::authorize('submit', $report);

        return $this->step(fn () => $this->workflow->submit($report, $request->user()), $report);
    }

    public function approve(Request $request, Report $report): ReportResource
    {
        Gate::authorize('approve', Report::class);

        return $this->step(fn () => $this->workflow->approve($report, $request->user()), $report);
    }

    public function publish(Request $request, Report $report): ReportResource
    {
        Gate::authorize('publish', Report::class);

        return $this->step(fn () => $this->workflow->publish($report->load('marks'), $request->user()), $report);
    }

    public function returnToDraft(Request $request, Report $report): ReportResource
    {
        Gate::authorize('approve', Report::class);
        $data = $request->validate(['reason' => ['nullable', 'string', 'max:255']]);

        return $this->step(fn () => $this->workflow->returnToDraft($report, $request->user(), $data['reason'] ?? null), $report);
    }

    /**
     * Approve or publish every eligible report of a class in one go.
     */
    public function bulk(Request $request, SchoolClass $class): JsonResponse
    {
        $data = $request->validate([
            'assessment_id' => ['required', 'integer'],
            'action' => ['required', Rule::in(['approve', 'publish'])],
        ]);
        Gate::authorize($data['action'], Report::class);
        $from = $data['action'] === 'approve' ? ReportStatus::Submitted : ReportStatus::Approved;
        $reports = Report::where('class_id', $class->id)->where('assessment_id', $data['assessment_id'])
            ->where('status', $from)->with('marks')->get();
        DB::transaction(function () use ($reports, $data, $request) {
            foreach ($reports as $report) {
                $data['action'] === 'approve'
                    ? $this->workflow->approve($report, $request->user())
                    : $this->workflow->publish($report, $request->user());
            }
        });

        return response()->json(['updated' => $reports->count()]);
    }

    public function acknowledge(Request $request, Report $report): ReportResource
    {
        Gate::authorize('acknowledge', $report);
        if (! $report->parent_acknowledged_at) {
            $report->forceFill(['parent_acknowledged_by' => $request->user()->id, 'parent_acknowledged_at' => now()])->save();
            AuditLog::record('report.acknowledged', $report);
        }

        return new ReportResource($report->load(self::WITH));
    }

    private function step(callable $action, Report $report): ReportResource
    {
        try {
            $action();
        } catch (InvalidArgumentException $e) {
            abort(422, $e->getMessage());
        }

        return new ReportResource($report->fresh(self::WITH));
    }
}
