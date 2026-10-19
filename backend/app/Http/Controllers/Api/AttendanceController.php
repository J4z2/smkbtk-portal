<?php

namespace App\Http\Controllers\Api;

use App\Enums\AttendanceStatus;
use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\AuditLog;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    /**
     * One day's register for a class.
     */
    public function classDay(Request $request, SchoolClass $class): JsonResponse
    {
        abort_unless(Access::canManageClass($request->user(), $class), 403);
        $date = $request->validate(['date' => ['required', 'date_format:Y-m-d']])['date'];
        $students = $class->students()->orderBy('name')->get(['students.id', 'students.name', 'students.student_no']);
        $records = AttendanceRecord::whereIn('student_id', $students->pluck('id'))->whereDate('date', $date)->get()->keyBy('student_id');

        return response()->json([
            'date' => $date,
            'students' => $students->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'student_no' => $s->student_no,
                'status' => $records[$s->id]->status->value ?? null,
                'note' => $records[$s->id]->note ?? null,
            ]),
        ]);
    }

    /**
     * Save a class register. Future dates are refused.
     */
    public function saveClassDay(Request $request, SchoolClass $class): JsonResponse
    {
        abort_unless(Access::canManageClass($request->user(), $class), 403);
        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'records' => ['required', 'array'],
            'records.*.student_id' => ['required', 'integer'],
            'records.*.status' => ['required', Rule::enum(AttendanceStatus::class)],
            'records.*.note' => ['nullable', 'string', 'max:255'],
        ]);
        $allowed = $class->students()->pluck('students.id')->all();
        DB::transaction(function () use ($data, $allowed, $request) {
            foreach ($data['records'] as $row) {
                abort_unless(in_array($row['student_id'], $allowed, true), 422, 'Pelajar bukan dalam kelas ini.');
                AttendanceRecord::updateOrCreate(
                    ['student_id' => $row['student_id'], 'date' => $data['date']],
                    ['status' => $row['status'], 'note' => $row['note'] ?? null, 'recorded_by' => $request->user()->id],
                );
            }
        });
        AuditLog::record('attendance.saved', $class, null, ['date' => $data['date'], 'count' => count($data['records'])]);

        return response()->json(['saved' => count($data['records'])]);
    }

    /**
     * One student's records for a month (YYYY-MM), with totals.
     */
    public function studentMonth(Request $request, Student $student): JsonResponse
    {
        Gate::authorize('view', $student);
        $month = $request->validate(['month' => ['required', 'date_format:Y-m']])['month'];
        $start = Carbon::createFromFormat('Y-m-d', $month.'-01')->startOfDay();
        $records = $student->attendance()
            ->whereBetween('date', [$start, $start->copy()->endOfMonth()])
            ->orderBy('date')->get();
        $present = $records->filter(fn ($r) => $r->status->countsAsPresent())->count();
        $months = $student->attendance()
            ->selectRaw($this->monthExpression().' as ym')->distinct()->orderByDesc('ym')->pluck('ym');

        return response()->json([
            'month' => $month,
            'months' => $months,
            'days' => $records->map(fn ($r) => ['date' => $r->date->toDateString(), 'status' => $r->status->value, 'note' => $r->note]),
            'total' => $records->count(),
            'present' => $present,
            'rate' => $records->count() ? (int) round($present / $records->count() * 100) : null,
        ]);
    }

    private function monthExpression(): string
    {
        return DB::connection()->getDriverName() === 'sqlite' ? "strftime('%Y-%m', date)" : "DATE_FORMAT(date, '%Y-%m')";
    }
}
