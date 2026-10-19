<?php

namespace App\Services;

use App\Enums\ReportStatus;
use App\Enums\Role;
use App\Models\AbsenceNotice;
use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Assessment;
use App\Models\AuditLog;
use App\Models\FormSubject;
use App\Models\Intervention;
use App\Models\MeetingBooking;
use App\Models\MeetingSlot;
use App\Models\PrivacyNotice;
use App\Models\Report;
use App\Models\SchoolClass;
use App\Models\Setting;
use App\Models\Subject;
use App\Models\User;
use App\Support\Access;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Builds the data object the portal page works with, in the same shape
 * the prototype kept in browser storage, filtered to what the user may
 * see. Students are keyed by student_no and classes by code, as before;
 * apiId fields carry the database ids for API calls.
 */
class PortalSnapshot
{
    private const BANDS = ['lower' => [1, 2, 3], 'upper' => [4, 5], 'form6' => [6]];

    private const CHECKPOINT_KEYS = ['tov', 'pat', 'ppt', 'trial'];

    public function __construct(private Coex $coex) {}

    /**
     * @return array<string, mixed>
     */
    public function for(User $user): array
    {
        $year = AcademicYear::current();
        $isParent = $user->role === Role::Parent;
        $classes = SchoolClass::where('academic_year_id', $year?->id)->with('classTeacher:id,name')->orderBy('form')->orderBy('name')->get();
        $assessments = Assessment::where('academic_year_id', $year?->id)->orderBy('sort_order')->get();

        // Plain rows instead of models: an admin snapshot covers the whole
        // school (tens of thousands of marks), so memory matters.
        $students = Access::students($user)
            ->leftJoin('enrolments as e', fn ($j) => $j->on('e.student_id', '=', 'students.id')->where('e.is_current', true))
            ->leftJoin('classes as c', 'c.id', '=', 'e.class_id')
            ->orderBy('students.name')
            ->toBase()
            ->get(['students.id', 'students.student_no', 'students.name', 'students.gender', 'students.status', 'students.photo_path', 'c.code as class_code', 'c.form as class_form']);
        $studentIds = $students->pluck('id')->all();

        $reports = DB::table('reports')
            ->join('assessments', 'assessments.id', '=', 'reports.assessment_id')
            ->leftJoin('users as approver', 'approver.id', '=', 'reports.approved_by')
            ->whereIn('reports.assessment_id', $assessments->pluck('id'))
            ->when(! $user->isAdmin(), fn ($q) => $q->whereIn('reports.student_id', $studentIds))
            ->when($isParent, fn ($q) => $q->where('reports.status', ReportStatus::Published->value))
            ->get([
                'reports.id', 'reports.student_id', 'reports.status', 'reports.teacher_comment', 'reports.support_note',
                'reports.discipline_note', 'reports.co_score', 'reports.attendance_rate', 'reports.submitted_at',
                'reports.approved_at', 'reports.published_at', 'reports.parent_acknowledged_at',
                'assessments.key', 'assessments.form', 'assessments.name_ms', 'assessments.sort_order', 'approver.name as approver',
            ]);
        $marks = [];
        foreach (array_chunk($reports->pluck('id')->all(), 5000) as $chunk) {
            DB::table('marks')->join('subjects', 'subjects.id', '=', 'marks.subject_id')
                ->whereIn('marks.report_id', $chunk)
                ->get(['marks.report_id', 'subjects.name_ms', 'marks.mark'])
                ->each(function ($m) use (&$marks) {
                    $marks[$m->report_id][$m->name_ms] = $m->mark;
                });
        }
        $reportsByStudent = $reports->groupBy('student_id');

        $targets = DB::table('targets')->join('subjects', 'subjects.id', '=', 'targets.subject_id')
            ->where('targets.academic_year_id', $year?->id)
            ->when(! $user->isAdmin(), fn ($q) => $q->whereIn('targets.student_id', $studentIds))
            ->get(['targets.student_id', 'subjects.name_ms', 'targets.target_mark'])
            ->groupBy('student_id');
        $attendance = $user->isAdmin() ? collect() : DB::table('attendance_records')
            ->whereIn('student_id', $studentIds)
            ->whereBetween('date', [$year?->starts_on, $year?->ends_on])
            ->get(['student_id', 'date', 'status', 'note'])
            ->groupBy('student_id');
        $guardians = DB::table('guardian_student')->join('guardians', 'guardians.id', '=', 'guardian_student.guardian_id')
            ->when(! $user->isAdmin(), fn ($q) => $q->whereIn('guardian_student.student_id', $studentIds))
            ->whereNull('guardians.deleted_at')
            ->orderByDesc('guardian_student.is_primary')
            ->get(['guardian_student.student_id', 'guardians.id', 'guardians.name', 'guardians.phone'])
            ->groupBy('student_id');
        $subjectProfiles = $this->subjectProfiles();
        $formSubjects = FormSubject::join('subjects', 'subjects.id', '=', 'form_subjects.subject_id')
            ->orderBy('subjects.name_ms')->get(['form_subjects.form', 'subjects.name_ms'])
            ->groupBy('form')->map->pluck('name_ms');
        $currentNames = $assessments->where('is_current', true)->pluck('name_ms', 'form');

        return [
            'user' => ['id' => $user->id, 'name' => $user->name, 'role' => $user->role->value],
            'school' => [
                'name' => Setting::get('school.name', 'SMK Bandar Tasik Kesuma'),
                'address' => Setting::get('school.address', ''),
                'phone' => Setting::get('school.phone', ''),
                'email' => Setting::get('school.email', ''),
                'officeHours' => Setting::get('school.office_hours', ''),
                'session' => (string) ($year?->year ?? ''),
                'term' => $this->currentCheckpointName($assessments),
                'classes' => $classes->map(fn (SchoolClass $c) => [
                    'id' => $c->code,
                    'apiId' => $c->id,
                    'name' => $c->name,
                    'form' => $c->form,
                    'band' => $this->band($c->form),
                    'session' => $c->session,
                    'isDlp' => $c->is_dlp,
                    'teacher' => $c->classTeacher?->name,
                ])->values(),
                'subjectProfiles' => $subjectProfiles,
                'subjects' => array_values(array_unique(array_merge(...array_values($subjectProfiles)))),
                'subjectIds' => Subject::pluck('id', 'name_ms'),
                'activities' => [],
                'examDates' => $this->examDates($assessments),
                'assessments' => $assessments->map->only(['id', 'form', 'key', 'name_ms', 'is_open', 'is_current'])->values(),
            ],
            'coexSettings' => $this->coexSettings(),
            'accounts' => $this->accounts($user, $classes),
            'students' => $students->map(fn ($s) => $this->student(
                $s,
                $reportsByStudent->get($s->id, collect()),
                $marks,
                $targets->get($s->id, collect()),
                $attendance->get($s->id, collect()),
                $guardians->get($s->id, collect())->first(),
                $formSubjects,
                $currentNames,
                (string) ($year?->year ?? ''),
            ))->values(),
            'absenceRequests' => $this->absenceNotices($studentIds, $students),
            'announcements' => $this->announcements($user),
            ...$this->meetings($user, $studentIds, $students),
            'interventions' => $user->role->isStaff() ? $this->interventions($studentIds, $students) : [],
            'audit' => $user->isAdmin() ? $this->audit() : [],
            'consent' => [
                'privacyPolicy' => PrivacyNotice::current() !== null,
                'guardianConsent' => PrivacyNotice::current() !== null,
                'lastReview' => PrivacyNotice::current()?->published_at?->toDateString() ?? '',
            ],
        ];
    }

    /**
     * @param  Collection<int, object>  $reports
     * @param  array<int, array<string, int|null>>  $marks
     * @param  Collection<int, object>  $targets
     * @param  Collection<int, object>  $attendance
     * @param  Collection<int, Collection<int, string>>  $formSubjects
     * @param  Collection<int, string>  $currentNames
     * @return array<string, mixed>
     */
    private function student(object $s, Collection $reports, array $marks, Collection $targets, Collection $attendance, ?object $guardian, Collection $formSubjects, Collection $currentNames, string $year): array
    {
        $form = $s->class_form !== null ? (int) $s->class_form : null;
        $byKey = $reports->filter(fn ($r) => (int) $r->form === $form)->keyBy('key');
        $current = $byKey->get('trial');
        $marksOf = fn ($r) => $r ? ($marks[$r->id] ?? []) : [];
        $iso = fn ($v) => $v ? Carbon::parse($v)->toIso8601String() : null;

        // Parents only receive published reports; staff see all.
        $checkpoints = [];
        foreach (self::CHECKPOINT_KEYS as $key) {
            $r = $byKey->get($key);
            $checkpoints[$key] = ['marks' => $marksOf($r), 'status' => $r?->status ?? 'draft', 'apiId' => $r?->id];
        }
        $checkpoints['target'] = [
            'marks' => $targets->pluck('target_mark', 'name_ms')->all(),
            'status' => 'published',
        ];

        $history = $byKey->except('trial')
            ->filter(fn ($r) => $r->status === ReportStatus::Published->value)
            ->sortBy('sort_order')
            ->map(fn ($r) => ['term' => $r->name_ms, 'avg' => Coex::average(array_values($marksOf($r))), 'attendance' => $r->attendance_rate])
            ->filter(fn ($h) => $h['avg'] !== null)
            ->reverse()->values()->all();

        // No report yet: show the form's subjects with no marks.
        $scores = $current ? $marksOf($current) : ($form ? array_fill_keys($formSubjects->get($form, collect())->all(), null) : []);

        return [
            'id' => $s->student_no,
            'apiId' => $s->id,
            'name' => $s->name,
            'classId' => $s->class_code,
            'guardianId' => $guardian ? 'G'.$guardian->id : null,
            'guardianApiId' => $guardian?->id,
            'guardian' => $guardian?->name ?? '',
            'guardianPhone' => $guardian?->phone ?? '',
            'photo' => '',
            'hasPhoto' => $s->photo_path !== null,
            'status' => $s->status === 'active' ? 'active' : 'archived',
            'gender' => $s->gender === 'P' ? 'Perempuan' : 'Lelaki',
            'attendanceEntries' => $attendance->mapWithKeys(fn ($a) => [substr($a->date, 0, 10) => $a->status])->all(),
            'attendanceNotes' => $attendance->filter(fn ($a) => $a->note)->mapWithKeys(fn ($a) => [substr($a->date, 0, 10) => $a->note])->all(),
            'scores' => $scores,
            'co' => $current?->co_score ?? 0,
            'activities' => [],
            'comment' => $current?->teacher_comment ?? '',
            'discipline' => $current?->discipline_note ?: 'Tiada rekod disiplin',
            'support' => $current?->support_note ?? '',
            'report' => [
                'apiId' => $current?->id,
                'session' => $year,
                'term' => $current?->name_ms ?? ($currentNames[$form] ?? ''),
                'status' => $current?->status ?? 'draft',
                'submittedAt' => $iso($current?->submitted_at),
                'approvedAt' => $iso($current?->approved_at),
                'publishedAt' => $iso($current?->published_at),
                'approvedBy' => $current?->approver ?? '',
            ],
            'history' => $history,
            'coex' => [
                'checkpoints' => $checkpoints,
                'parentAcknowledgedAt' => $iso($current?->parent_acknowledged_at),
                'counsellorNotes' => [],
            ],
        ];
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function subjectProfiles(): array
    {
        $rows = FormSubject::with('subject')->get();
        $out = [];
        foreach (self::BANDS as $band => $forms) {
            $out[$band] = $rows->whereIn('form', $forms)->pluck('subject.name_ms')->unique()->sort()->values()->all();
        }

        return $out;
    }

    private function band(int $form): string
    {
        return $form <= 3 ? 'lower' : ($form === 6 ? 'form6' : 'upper');
    }

    /**
     * @param  Collection<int, Assessment>  $assessments
     */
    private function currentCheckpointName(Collection $assessments): string
    {
        return $assessments->firstWhere('is_current', true)?->name_ms ?? '';
    }

    /**
     * @param  Collection<int, Assessment>  $assessments
     * @return array<int, array<string, string>>
     */
    private function examDates(Collection $assessments): array
    {
        $out = [];
        foreach ($assessments as $a) {
            $out[$a->form][$a->key] = $a->exam_date?->toDateString() ?? '';
        }

        return $out;
    }

    /**
     * @return array<string, mixed>
     */
    private function coexSettings(): array
    {
        return [
            'lmsPassMark' => (int) Setting::get('coex.lms_pass_mark', 40),
            'creditGear' => (int) Setting::get('coex.credit_gear', 5),
            'purpleGear' => (int) Setting::get('coex.purple_gear', 10),
            'currentCheckpoint' => 'trial',
            'checkpoints' => ['tov' => 'Diagnostik', 'pat' => 'Pentaksiran 1', 'ppt' => 'Pentaksiran 2', 'trial' => 'Penilaian Semasa', 'target' => 'Sasaran'],
            'rules' => $this->coex->rules()->map(fn ($r) => [
                'gear' => $r->gear, 'min' => $r->min_mark, 'max' => $r->max_mark, 'grade' => $r->grade,
                'zone' => $r->zone, 'level' => $r->level, 'action' => $r->action_ms, 'color' => $r->color,
            ])->values()->all(),
        ];
    }

    /**
     * @param  Collection<int, SchoolClass>  $classes
     * @return array<string, mixed>
     */
    private function accounts(User $user, Collection $classes): array
    {
        $me = ['id' => 'U'.$user->id, 'apiId' => $user->id, 'name' => $user->name, 'email' => $user->email ?? '', 'phone' => $user->phone ?? ''];
        $teacherRow = fn (User $t) => [
            'id' => 'U'.$t->id,
            'apiId' => $t->id,
            'name' => $t->name,
            'email' => $t->email ?? '',
            'password' => '',
            'role' => $t->role->value,
            'roles' => [$t->role === Role::ClassTeacher ? 'Guru Kelas' : ($t->role === Role::SuperAdmin ? 'Super Admin' : 'Pentadbir')],
            'classes' => $classes->where('class_teacher_id', $t->id)->pluck('code')->values()->all(),
            'subjects' => [],
            'canAttendance' => true,
            'active' => $t->is_active,
        ];

        return match ($user->role) {
            Role::Parent => [
                'parents' => [$me + [
                    'address' => $user->guardian?->address ?? '',
                    'childIds' => Access::students($user)->pluck('student_no')->all(),
                ]],
                'teachers' => [],
                'super' => [],
            ],
            Role::ClassTeacher => ['parents' => [], 'teachers' => [$teacherRow($user)], 'super' => []],
            default => [
                'parents' => [],
                'teachers' => User::where('role', '!=', Role::Parent)->orderBy('name')->get()->map($teacherRow)->values()->all(),
                'super' => [$me],
            ],
        };
    }

    /**
     * @param  array<int, int>  $studentIds
     * @param  Collection<int, object>  $students
     * @return array<int, array<string, mixed>>
     */
    private function absenceNotices(array $studentIds, Collection $students): array
    {
        $numbers = $students->pluck('student_no', 'id');
        $reasons = ['keluarga' => 'Urusan keluarga', 'kesihatan' => 'Rawatan kesihatan', 'mc' => 'MC / sijil sakit', 'lain' => 'Lain-lain'];

        return AbsenceNotice::whereIn('student_id', $studentIds)->latest()->limit(200)->get()->map(fn ($n) => [
            'id' => 'ABS-'.$n->id,
            'apiId' => $n->id,
            'studentId' => $numbers[$n->student_id] ?? null,
            'date' => $n->date_from->toDateString(),
            'dateTo' => $n->date_to->toDateString(),
            'reason' => $reasons[$n->reason] ?? $n->reason,
            'note' => $n->note ?? '',
            'document' => $n->document_path !== null,
            'status' => $n->status,
        ])->values()->all();
    }

    /**
     * Upcoming slots for the user's classes, and bookings for their students.
     *
     * @param  array<int, int>  $studentIds
     * @param  Collection<int, object>  $students
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function meetings(User $user, array $studentIds, Collection $students): array
    {
        $classCodes = $students->pluck('class_code')->filter()->unique();
        $slots = MeetingSlot::query()
            ->select(['meeting_slots.*', 'classes.code as class_code'])
            ->join('classes', 'classes.id', '=', 'meeting_slots.class_id')
            ->where('meeting_slots.date', '>=', now()->subDays(30)->toDateString())
            ->when(! $user->isAdmin(), fn ($q) => $q->whereIn('classes.code', $classCodes)->where('classes.academic_year_id', AcademicYear::current()?->id))
            ->withCount(['bookings as booked' => fn ($q) => $q->where('status', 'booked')])
            ->orderBy('meeting_slots.date')->orderBy('meeting_slots.starts_at')
            ->get();
        $numbers = $students->pluck('student_no', 'id');
        $bookings = MeetingBooking::query()
            ->whereIn('meeting_slot_id', $slots->pluck('id'))
            ->when($user->role === Role::Parent, fn ($q) => $q->whereIn('student_id', $studentIds))
            ->with('student:id,name')
            ->latest()->get();
        $hm = fn ($t) => substr((string) $t, 0, 5);

        return [
            'meetingSlots' => $slots->map(fn ($s) => [
                'apiId' => $s->id,
                'classId' => $s->class_code,
                'date' => $s->date->toDateString(),
                'startsAt' => $hm($s->starts_at),
                'endsAt' => $hm($s->ends_at),
                'capacity' => $s->capacity,
                'booked' => $s->booked,
            ])->values()->all(),
            'meetings' => $bookings->map(function ($b) use ($slots, $numbers, $hm) {
                $slot = $slots->firstWhere('id', $b->meeting_slot_id);

                return [
                    'id' => 'MEET-'.$b->id,
                    'apiId' => $b->id,
                    'slotApiId' => $b->meeting_slot_id,
                    'studentId' => $numbers[$b->student_id] ?? null,
                    'studentName' => $b->student?->name ?? '',
                    'topic' => $b->topic,
                    'date' => $slot->date->toDateString(),
                    'slot' => $hm($slot->starts_at).' – '.$hm($slot->ends_at),
                    'status' => $b->status,
                ];
            })->values()->all(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function announcements(User $user): array
    {
        $items = Announcement::visibleTo($user)->limit(100)->get()->toArray();

        return collect($items)->map(fn ($a) => [
            'id' => 'ANN-'.$a['id'],
            'title' => $a['title_ms'],
            'body' => $a['body_ms'],
            'category' => ucfirst($a['category']),
            'date' => substr((string) ($a['published_at'] ?? $a['created_at']), 0, 10),
        ])->values()->all();
    }

    /**
     * @param  array<int, int>  $studentIds
     * @param  Collection<int, object>  $students
     * @return array<int, array<string, mixed>>
     */
    private function interventions(array $studentIds, Collection $students): array
    {
        $numbers = $students->pluck('student_no', 'id');

        return Intervention::whereIn('student_id', $studentIds)->with(['subject', 'owner:id,name'])->oldest()->get()->map(fn ($i) => [
            'id' => 'INT-'.$i->id,
            'apiId' => $i->id,
            'studentId' => $numbers[$i->student_id] ?? null,
            'subject' => $i->subject?->name_ms ?? '-',
            'type' => $i->type,
            'owner' => $i->owner?->name ?? '',
            'followUp' => $i->follow_up_on?->toDateString() ?? '',
            'note' => $i->note,
            'status' => $i->status,
            'createdAt' => $i->created_at->toIso8601String(),
        ])->values()->all();
    }

    /**
     * Latest 80 audit entries, in the prototype's {actor, action, type} form.
     *
     * @return array<int, array<string, mixed>>
     */
    private function audit(): array
    {
        return AuditLog::with(['user:id,name', 'auditable'])->latest('created_at')->latest('id')->limit(80)->get()->map(fn (AuditLog $a) => [
            'id' => 'AUD-'.$a->id,
            'at' => $a->created_at->toIso8601String(),
            'actor' => $a->user?->name ?? 'Sistem',
            'action' => AuditText::describe($a),
            'type' => AuditText::tone($a->action),
        ])->values()->all();
    }
}
