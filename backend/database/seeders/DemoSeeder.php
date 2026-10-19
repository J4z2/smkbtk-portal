<?php

namespace Database\Seeders;

use App\Enums\ReportStatus;
use App\Enums\Role;
use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\AttendanceRecord;
use App\Models\Enrolment;
use App\Models\Guardian;
use App\Models\Report;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use App\Services\Coex;
use App\Services\ReportBook;
use App\Support\Identity;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * The prototype's fictional demo school, for local testing only.
 * Never run in production: the demo passwords are public.
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new RuntimeException('DemoSeeder must not run in production.');
        }
        $year = AcademicYear::current();

        $admin = $this->user('Super Admin Sekolah', Role::SuperAdmin, 'admin@smkbtk.com', 'admin123');
        $this->user('Pentadbir Demo', Role::Admin, 'pentadbir@smkbtk.com', 'admin123');
        $teachers = [
            '5M' => $this->user('Cikgu Farah Binti Salleh', Role::ClassTeacher, 'guru@smkbtk.com', 'guru123'),
            '1A' => $this->user('Cikgu Demo Tingkatan 1', Role::ClassTeacher, 'guru.demo@smkbtk.com', 'guru123'),
        ];
        $classDefs = [
            ['1A', 'Tingkatan 1 Amanah', 1, null], ['2B', 'Tingkatan 2 Bestari', 2, null], ['3C', 'Tingkatan 3 Cemerlang', 3, null],
            ['4M', 'Tingkatan 4 Melor', 4, null], ['5M', 'Tingkatan 5 Melor', 5, null], ['5A', 'Tingkatan 5 Anggerik', 5, null],
            ['6R', 'Tingkatan 6 Rendah', 6, 'bawah'], ['6A', 'Tingkatan 6 Atas', 6, 'atas'],
        ];
        $classes = [];
        foreach ($classDefs as [$code, $name, $form, $stage]) {
            $classes[$code] = SchoolClass::firstOrCreate(
                ['academic_year_id' => $year->id, 'code' => $code],
                ['name' => $name, 'form' => $form, 'form6_stage' => $stage, 'class_teacher_id' => ($teachers[$code] ?? null)?->id],
            );
        }

        $guardians = [
            'noraini' => $this->guardian('Puan Noraini Binti Ismail', 'parent@smkbtk.com', '012-888 7312', '800101-01-1234'),
            'zulkifli' => $this->guardian('Encik Zulkifli Bin Omar', null, '012-977 2031', null),
            'rahimah' => $this->guardian('Puan Rahimah Binti Hassan', null, '013-463 7012', null),
            'salmah' => $this->guardian('Puan Salmah Binti Musa', 'parent.lower@smkbtk.com', '012-111 1101', null),
            'rahman' => $this->guardian('Encik Rahman Bin Idris', 'parent.form4@smkbtk.com', '012-444 4401', null),
            'mariam' => $this->guardian('Puan Mariam Binti Daud', 'parent.form6@smkbtk.com', '012-666 6601', null),
        ];
        foreach (['noraini', 'salmah', 'rahman', 'mariam'] as $key) {
            $g = $guardians[$key];
            if (! $g->user_id) {
                $user = $this->user($g->name, Role::Parent, $g->email, 'parent123');
                $user->setPhone($g->phone);
                if ($key === 'noraini') {
                    $user->setIc('800101-01-1234');
                }
                $user->save();
                $g->user()->associate($user)->save();
            }
        }

        // [no, name, class, guardian, gender, current marks by code, report status, absences]
        $students = [
            ['SMK2026-001', 'Aisyah Sofea Binti Ahmad', '5M', 'noraini', 'P', ['BM' => 88, 'BI' => 80, 'MT' => 75, 'SN' => 91, 'SEJ' => 83, 'PI' => 86], 'published', ['2026-06-23' => 'L']],
            ['SMK2026-004', 'Adam Danish Bin Ahmad', '5A', 'noraini', 'L', ['BM' => 78, 'BI' => 72, 'MT' => 84, 'SN' => 76, 'SEJ' => 74, 'PI' => 80], 'published', ['2026-06-12' => 'MC']],
            ['SMK2026-002', 'Muhammad Irfan Bin Zulkifli', '5M', 'zulkifli', 'L', ['BM' => 44, 'BI' => 49, 'MT' => 82, 'SN' => 79, 'SEJ' => 36, 'PI' => 77], 'submitted', ['2026-06-03' => 'A', '2026-06-09' => 'A']],
            ['SMK2026-003', 'Siti Nur Balqis Binti Rahim', '5M', 'rahimah', 'P', ['BM' => 90, 'BI' => 87, 'MT' => 88, 'SN' => 92, 'SEJ' => 86, 'PI' => 91], 'draft', []],
            ['SMK2026-101', 'Amir Hakim Bin Roslan', '1A', 'salmah', 'L', null, 'published', []],
            ['SMK2026-201', 'Nur Alya Binti Roslan', '2B', 'salmah', 'P', null, 'published', []],
            ['SMK2026-301', 'Danish Irfan Bin Roslan', '3C', 'salmah', 'L', null, 'published', []],
            ['SMK2026-401', 'Aqil Firdaus Bin Rahman', '4M', 'rahman', 'L', null, 'published', []],
            ['SMK2026-601', 'Nur Hanim Binti Daud', '6R', 'mariam', 'P', null, 'published', []],
        ];
        $bases = ['SMK2026-101' => 68, 'SMK2026-201' => 74, 'SMK2026-301' => 79, 'SMK2026-401' => 71, 'SMK2026-601' => 77];
        $book = app(ReportBook::class);
        $subjects = Subject::pluck('id', 'code');

        foreach ($students as $i => [$no, $name, $code, $gkey, $gender, $marks, $status, $absences]) {
            $student = Student::firstOrCreate(['student_no' => $no], ['name' => $name, 'gender' => $gender, 'race' => 'melayu', 'religion' => 'islam']);
            $class = $classes[$code];
            Enrolment::firstOrCreate(
                ['student_id' => $student->id, 'is_current' => true],
                ['class_id' => $class->id, 'academic_year_id' => $year->id, 'starts_on' => $year->starts_on],
            );
            $student->guardians()->syncWithoutDetaching([$guardians[$gkey]->id => ['relationship' => str_starts_with($guardians[$gkey]->name, 'Encik') ? 'bapa' : 'ibu', 'is_primary' => true]]);

            foreach (Assessment::where('academic_year_id', $year->id)->where('form', $class->form)->whereIn('key', ['tov', 'pat', 'ppt', 'trial'])->get() as $assessment) {
                $report = $book->forStudent($student, $class, $assessment);
                if ($report->wasRecentlyCreated === false && $report->marks()->whereNotNull('mark')->exists()) {
                    continue;
                }
                $offset = ['tov' => -11, 'pat' => -8, 'ppt' => -5, 'trial' => 0][$assessment->key];
                foreach ($report->marks()->with('subject')->get() as $j => $mark) {
                    $current = $marks[$mark->subject->code] ?? max(35, min(96, $bases[$no] + (($j % 4) - 1) * 3));
                    $wave = (($i + 1) * ($j + 3) * 7) % 9;
                    $mark->update(['mark' => $offset === 0 ? $current : max(0, min(100, $current + $offset + $wave - 4))]);
                }
                $report->update(['teacher_comment' => 'Menunjukkan perkembangan yang konsisten.', 'co_score' => 75]);
                $this->setStatus($report, $assessment->key === 'trial' ? $status : 'published', $admin);
            }

            foreach ($this->schoolDays('2026-06-01', '2026-06-30') as $day) {
                AttendanceRecord::firstOrCreate(
                    ['student_id' => $student->id, 'date' => $day],
                    ['status' => $absences[$day] ?? 'P', 'recorded_by' => $class->class_teacher_id],
                );
            }
        }
    }

    private function setStatus(Report $report, string $status, User $admin): void
    {
        $coex = app(Coex::class);
        $report->status = ReportStatus::from($status);
        $at = now()->subDays(10);
        foreach (['submitted', 'approved', 'published'] as $step) {
            if (array_search($step, ['draft', 'submitted', 'approved', 'published']) <= array_search($status, ['draft', 'submitted', 'approved', 'published'])) {
                $report->forceFill(["{$step}_by" => $admin->id, "{$step}_at" => $at]);
            }
        }
        if ($status === 'published') {
            foreach ($report->marks as $mark) {
                if ($mark->mark !== null) {
                    $rule = $coex->ruleFor($mark->mark);
                    $mark->forceFill(['grade' => Coex::displayGrade($rule->grade), 'gear' => $rule->gear])->save();
                }
            }
        }
        $report->save();
    }

    private function user(string $name, Role $role, ?string $email, string $password): User
    {
        return User::firstOrCreate(['email' => $email], [
            'name' => $name, 'role' => $role, 'password' => $password, 'must_change_password' => false,
        ]);
    }

    private function guardian(string $name, ?string $email, string $phone, ?string $ic): Guardian
    {
        $guardian = Guardian::firstOrNew(['name' => $name]);
        $guardian->fill(['email' => $email, 'phone' => Identity::normalizePhone($phone)]);
        if ($ic) {
            $guardian->setIc($ic);
        }
        $guardian->save();

        return $guardian;
    }

    /**
     * @return array<int, string>
     */
    private function schoolDays(string $from, string $to): array
    {
        $days = [];
        for ($d = strtotime($from); $d <= strtotime($to); $d += 86400) {
            if ((int) date('N', $d) <= 5) {
                $days[] = date('Y-m-d', $d);
            }
        }

        return $days;
    }
}
