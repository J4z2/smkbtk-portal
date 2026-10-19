<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Enums\ReportStatus;
use App\Models\AttendanceRecord;
use App\Models\AuditLog;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Moves a report through draft → submitted → approved → published.
 * Who may call each step is decided by ReportPolicy; this class only
 * enforces the order of steps and records them.
 */
class ReportWorkflow
{
    public function __construct(private Coex $coex) {}

    public function submit(Report $report, User $by): Report
    {
        $this->expect($report, ReportStatus::Draft);

        return $this->move($report, ReportStatus::Submitted, $by, 'report.submitted');
    }

    public function approve(Report $report, User $by): Report
    {
        $this->expect($report, ReportStatus::Submitted);

        return $this->move($report, ReportStatus::Approved, $by, 'report.approved');
    }

    /**
     * Publishing freezes the grade and Gear of each mark and the attendance
     * rate, so later rule changes never alter what parents were shown.
     */
    public function publish(Report $report, User $by): Report
    {
        $this->expect($report, ReportStatus::Approved);

        return DB::transaction(function () use ($report, $by) {
            foreach ($report->marks as $mark) {
                if ($mark->mark === null) {
                    continue;
                }
                $rule = $this->coex->ruleFor($mark->mark);
                $mark->forceFill(['grade' => Coex::displayGrade($rule->grade), 'gear' => $rule->gear])->save();
            }
            $report->attendance_rate = $this->attendanceRate($report);

            return $this->move($report, ReportStatus::Published, $by, 'report.published');
        });
    }

    /**
     * Admin sends a submitted or approved report back to the teacher.
     */
    public function returnToDraft(Report $report, User $by, ?string $reason = null): Report
    {
        if (! in_array($report->status, [ReportStatus::Submitted, ReportStatus::Approved], true)) {
            throw new InvalidArgumentException('Hanya laporan yang dihantar atau diluluskan boleh dikembalikan.');
        }
        $old = $report->status->value;
        $report->forceFill([
            'status' => ReportStatus::Draft,
            'approved_by' => null,
            'approved_at' => null,
        ])->save();
        AuditLog::record('report.returned', $report, ['status' => $old], ['status' => 'draft', 'reason' => $reason]);

        return $report;
    }

    /**
     * Attendance rate for the report's year up to the assessment date (or today).
     */
    public function attendanceRate(Report $report): ?int
    {
        $assessment = $report->assessment;
        $year = $assessment->academicYear;
        $records = AttendanceRecord::where('student_id', $report->student_id)
            ->whereBetween('date', [$year->starts_on, $assessment->exam_date ?? now()])
            ->pluck('status');
        if ($records->isEmpty()) {
            return null;
        }
        $present = $records->filter(fn (AttendanceStatus $s) => $s->countsAsPresent())->count();

        return (int) round($present / $records->count() * 100);
    }

    private function expect(Report $report, ReportStatus $status): void
    {
        if ($report->status !== $status) {
            throw new InvalidArgumentException("Laporan mesti berstatus {$status->value}, bukan {$report->status->value}.");
        }
    }

    private function move(Report $report, ReportStatus $to, User $by, string $action): Report
    {
        $old = $report->status->value;
        $step = match ($to) {
            ReportStatus::Submitted => 'submitted',
            ReportStatus::Approved => 'approved',
            ReportStatus::Published => 'published',
            ReportStatus::Draft => null,
        };
        $report->status = $to;
        if ($step) {
            $report->forceFill(["{$step}_by" => $by->id, "{$step}_at" => now()]);
        }
        $report->save();
        AuditLog::record($action, $report, ['status' => $old], ['status' => $to->value]);

        return $report;
    }
}
