<?php

namespace App\Services;

use App\Enums\ReportStatus;
use App\Enums\Role;
use App\Models\AbsenceNotice;
use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Assessment;
use App\Models\AttendanceRecord;
use App\Models\AuditLog;
use App\Models\FormSubject;
use App\Models\Intervention;
use App\Models\PrivacyNotice;
use App\Models\Report;
use App\Models\SchoolClass;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Target;
use App\Models\User;
use App\Support\Access;
use Illuminate\Support\Collection;

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
        $students = Access::students($user)
            ->with(['currentEnrolment.schoolClass', 'guardians'])
            ->get();
        $studentIds = $students->pluck('id');

        $reports = Report::whereIn('student_id', $studentIds)
            ->whereIn('assessment_id', $assessments->pluck('id'))
            ->when($isParent, fn ($q) => $q->where('status', ReportStatus::Published))
            ->with(['marks.subject', 'assessment', 'approver:id,name'])
            ->get()
            ->groupBy('student_id');
        $targets = Target::whereIn('student_id', $studentIds)->where('academic_year_id', $year?->id)->with('subject')->get()->groupBy('student_id');
        $attendance = $user->isAdmin() ? collect() : AttendanceRecord::whereIn('student_id', $studentIds)
            ->whereBetween('date', [$year?->starts_on, $year?->ends_on])->get()->groupBy('student_id');
        $subjectProfiles = $this->subjectProfiles();

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
            'students' => $students->map(fn (Student $s) => $this->student(
                $s,
                $reports->get($s->id, collect()),
                $targets->get($s->id, collect()),
                $attendance->get($s->id, collect()),
                $assessments,
                $isParent,
            ))->values(),
            'absenceRequests' => $this->absenceNotices($studentIds, $students),
            'announcements' => $this->announcements($user),
            'meetings' => [],
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
     * @param  Collection<int, Report>  $reports
     * @param  Collection<int, Target>  $targets
     * @param  Collection<int, AttendanceRecord>  $attendance
     * @param  Collection<int, Assessment>  $assessments
     * @return array<string, mixed>
     */
    private function student(Student $s, Collection $reports, Collection $targets, Collection $attendance, Collection $assessments, bool $isParent): array
    {
        $class = $s->currentEnrolment?->schoolClass;
        $form = $class?->form;
        $byKey = $reports->filter(fn (Report $r) => $r->assessment->form === $form)->keyBy(fn (Report $r) => $r->assessment->key);
        $current = $byKey->get('trial');
        $guardian = $s->guardians->sortByDesc(fn ($g) => $g->pivot->is_primary)->first();
        $marksOf = fn (?Report $r) => $r ? $r->marks->mapWithKeys(fn ($m) => [$m->subject->name_ms => $m->mark])->all() : [];

        // Parents only receive checkpoints that are published; staff see all.
        $checkpoints = [];
        foreach (self::CHECKPOINT_KEYS as $key) {
            $r = $byKey->get($key);
            $checkpoints[$key] = ['marks' => $marksOf($r), 'status' => $r?->status->value ?? 'draft', 'apiId' => $r?->id];
        }
        $checkpoints['target'] = [
            'marks' => $targets->mapWithKeys(fn ($t) => [$t->subject->name_ms => $t->target_mark])->all(),
            'status' => 'published',
        ];

        $history = $byKey->except('trial')
            ->filter(fn (Report $r) => $r->isPublished())
            ->sortBy(fn (Report $r) => $r->assessment->sort_order)
            ->map(fn (Report $r) => [
                'term' => $r->assessment->name_ms,
                'avg' => Coex::average($r->marks->pluck('mark')->all()),
                'attendance' => $r->attendance_rate,
            ])
            ->filter(fn ($h) => $h['avg'] !== null)
            ->reverse()->values()->all();

        $scores = $current ? $marksOf($current) : [];
        if (! $current && $class) {
            // No report yet: show the class's subjects with no marks.
            $scores = array_fill_keys($this->subjectNamesForForm($class->form), null);
        }

        return [
            'id' => $s->student_no,
            'apiId' => $s->id,
            'name' => $s->name,
            'classId' => $class?->code,
            'guardianId' => $guardian ? 'G'.$guardian->id : null,
            'guardianApiId' => $guardian?->id,
            'guardian' => $guardian?->name ?? '',
            'guardianPhone' => $guardian?->phone ?? '',
            'photo' => '',
            'hasPhoto' => $s->photo_path !== null,
            'status' => $s->status->value === 'active' ? 'active' : 'archived',
            'gender' => $s->gender === 'P' ? 'Perempuan' : 'Lelaki',
            'attendanceEntries' => $attendance->mapWithKeys(fn ($a) => [$a->date->toDateString() => $a->status->value])->all(),
            'attendanceNotes' => $attendance->filter(fn ($a) => $a->note)->mapWithKeys(fn ($a) => [$a->date->toDateString() => $a->note])->all(),
            'scores' => $scores,
            'co' => $current?->co_score ?? 0,
            'activities' => [],
            'comment' => $current?->teacher_comment ?? '',
            'discipline' => $current?->discipline_note ?: 'Tiada rekod disiplin',
            'support' => $current?->support_note ?? '',
            'report' => [
                'apiId' => $current?->id,
                'session' => (string) ($current?->assessment->academicYear->year ?? AcademicYear::current()?->year),
                'term' => $current?->assessment->name_ms ?? $this->currentCheckpointName($assessments->where('form', $form)),
                'status' => $current?->status->value ?? 'draft',
                'submittedAt' => $current?->submitted_at?->toIso8601String(),
                'approvedAt' => $current?->approved_at?->toIso8601String(),
                'publishedAt' => $current?->published_at?->toIso8601String(),
                'approvedBy' => $current?->approver?->name ?? '',
            ],
            'history' => $history,
            'coex' => [
                'checkpoints' => $checkpoints,
                'parentAcknowledgedAt' => $current?->parent_acknowledged_at?->toIso8601String(),
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

    /**
     * @return array<int, string>
     */
    private function subjectNamesForForm(int $form): array
    {
        return FormSubject::where('form', $form)->with('subject')->get()->pluck('subject.name_ms')->sort()->values()->all();
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
     * @param  Collection<int, int>  $studentIds
     * @param  Collection<int, Student>  $students
     * @return array<int, array<string, mixed>>
     */
    private function absenceNotices(Collection $studentIds, Collection $students): array
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
     * @param  Collection<int, int>  $studentIds
     * @param  Collection<int, Student>  $students
     * @return array<int, array<string, mixed>>
     */
    private function interventions(Collection $studentIds, Collection $students): array
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
