<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\FormSubject;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

/**
 * A school the size of SMK Bandar Tasik Kesuma (2,652 students in 60
 * classes) with fictional names, for performance testing only.
 * Run on an empty database: php artisan db:seed --class=LoadTestSeeder
 */
class LoadTestSeeder extends Seeder
{
    // Classes per form and students per form, from the 2026 enrolment sheet.
    private const FORMS = [1 => [12, 588], 2 => [12, 543], 3 => [12, 549], 4 => [10, 442], 5 => [10, 408], 6 => [4, 122]];

    public function run(): void
    {
        if (app()->isProduction()) {
            throw new RuntimeException('LoadTestSeeder must not run in production.');
        }
        $this->call(ReferenceDataSeeder::class);
        $year = AcademicYear::current();
        $password = Hash::make('load123');
        $now = now();
        $admin = User::create(['name' => 'Load Admin', 'role' => Role::SuperAdmin, 'email' => 'load.admin@test.my', 'password' => 'load123', 'must_change_password' => false]);

        $subjectsByForm = FormSubject::get()->groupBy('form')->map->pluck('subject_id');
        $assessments = Assessment::where('academic_year_id', $year->id)->whereIn('key', ['tov', 'pat', 'ppt', 'trial'])->get()->groupBy('form');
        $days = [];
        for ($d = strtotime('2026-03-02'); count($days) < 100; $d += 86400) {
            if ((int) date('N', $d) <= 5) {
                $days[] = date('Y-m-d', $d);
            }
        }

        $studentNo = 0;
        foreach (self::FORMS as $form => [$classCount, $studentCount]) {
            $perClass = intdiv($studentCount, $classCount);
            for ($c = 1; $c <= $classCount; $c++) {
                $teacherId = DB::table('users')->insertGetId(['name' => "Guru {$form}-{$c}", 'role' => 'class_teacher', 'email' => "guru{$form}{$c}@test.my", 'password' => $password, 'must_change_password' => false, 'is_active' => true, 'locale' => 'ms', 'created_at' => $now, 'updated_at' => $now]);
                $classId = DB::table('classes')->insertGetId(['academic_year_id' => $year->id, 'form' => $form, 'name' => "{$form} Kelas {$c}", 'code' => "{$form}K{$c}", 'session' => $form <= 3 ? 'petang' : 'pagi', 'class_teacher_id' => $teacherId, 'is_dlp' => false, 'created_at' => $now, 'updated_at' => $now]);

                $marks = $attendance = [];
                for ($i = 0; $i < $perClass; $i++) {
                    $studentNo++;
                    $sid = DB::table('students')->insertGetId(['student_no' => sprintf('LT%05d', $studentNo), 'name' => "Murid Ujian {$studentNo}", 'gender' => $i % 2 ? 'L' : 'P', 'race' => 'melayu', 'religion' => 'islam', 'is_citizen' => true, 'status' => 'active', 'created_at' => $now, 'updated_at' => $now]);
                    DB::table('enrolments')->insert(['student_id' => $sid, 'class_id' => $classId, 'academic_year_id' => $year->id, 'starts_on' => '2026-01-12', 'is_current' => true, 'created_at' => $now, 'updated_at' => $now]);
                    $userId = DB::table('users')->insertGetId(['name' => "Penjaga {$studentNo}", 'role' => 'parent', 'email' => "penjaga{$studentNo}@test.my", 'password' => $password, 'must_change_password' => false, 'is_active' => true, 'locale' => 'ms', 'created_at' => $now, 'updated_at' => $now]);
                    $gid = DB::table('guardians')->insertGetId(['user_id' => $userId, 'name' => "Penjaga {$studentNo}", 'created_at' => $now, 'updated_at' => $now]);
                    DB::table('guardian_student')->insert(['guardian_id' => $gid, 'student_id' => $sid, 'relationship' => 'ibu', 'is_primary' => true, 'can_view' => true, 'created_at' => $now, 'updated_at' => $now]);
                    $base = 35 + ($studentNo * 37) % 60;
                    foreach ($assessments[$form] as $a) {
                        $rid = DB::table('reports')->insertGetId(['student_id' => $sid, 'assessment_id' => $a->id, 'class_id' => $classId, 'status' => $a->key === 'trial' ? 'draft' : 'published', 'teacher_comment' => 'Ulasan ujian.', 'created_at' => $now, 'updated_at' => $now]);
                        foreach ($subjectsByForm[$form] as $j => $subjectId) {
                            $marks[] = ['report_id' => $rid, 'subject_id' => $subjectId, 'mark' => min(100, $base + ($j * 7) % 20), 'is_absent' => false, 'created_at' => $now, 'updated_at' => $now];
                        }
                    }
                    foreach ($days as $k => $day) {
                        $attendance[] = ['student_id' => $sid, 'date' => $day, 'status' => ($k + $sid) % 23 === 0 ? 'A' : 'P', 'created_at' => $now, 'updated_at' => $now];
                    }
                }
                foreach (array_chunk($marks, 1000) as $chunk) {
                    DB::table('marks')->insert($chunk);
                }
                foreach (array_chunk($attendance, 2000) as $chunk) {
                    DB::table('attendance_records')->insert($chunk);
                }
            }
        }
    }
}
