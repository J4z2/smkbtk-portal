<?php

namespace App\Console\Commands;

use App\Enums\StudentStatus;
use App\Models\AuditLog;
use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * PDPA retention: once a student has been gone for the retention period
 * (default 5 years), remove everything that identifies them. Marks and
 * attendance statuses stay, without a name, for school statistics.
 * Guardians are anonymised only when none of their children remain.
 */
class AnonymiseLeavers extends Command
{
    protected $signature = 'portal:anonymise-leavers {--dry-run : Only report how many records would change}';

    protected $description = 'Anonymise students who left more than the retention period ago';

    public function handle(): int
    {
        $cutoff = now()->subYears((int) config('portal.retention_years'))->toDateString();
        $students = Student::withTrashed()
            ->where('status', '!=', StudentStatus::Active)
            ->whereNotNull('left_on')
            ->where('left_on', '<=', $cutoff)
            ->where('student_no', 'not like', 'ANON-%')
            ->get();

        if ($this->option('dry-run')) {
            $this->info("{$students->count()} student record(s) would be anonymised (left on or before {$cutoff}).");

            return self::SUCCESS;
        }

        $guardianIds = [];
        foreach ($students as $student) {
            DB::transaction(function () use ($student, &$guardianIds) {
                if ($student->photo_path) {
                    Storage::disk('local')->delete($student->photo_path);
                }
                $student->forceFill([
                    'student_no' => 'ANON-'.$student->id,
                    'name' => 'Murid dianonimkan #'.$student->id,
                    'ic_hash' => null,
                    'ic_encrypted' => null,
                    'date_of_birth' => null,
                    'race' => null,
                    'religion' => null,
                    'photo_path' => null,
                    'status' => StudentStatus::Archived,
                ])->save();
                DB::table('reports')->where('student_id', $student->id)
                    ->update(['teacher_comment' => null, 'support_note' => null, 'discipline_note' => null]);
                DB::table('attendance_records')->where('student_id', $student->id)->update(['note' => null]);
                foreach (DB::table('absence_notices')->where('student_id', $student->id)->whereNotNull('document_path')->pluck('document_path') as $path) {
                    Storage::disk('local')->delete($path);
                }
                DB::table('absence_notices')->where('student_id', $student->id)->update(['note' => null, 'document_path' => null]);
                DB::table('interventions')->where('student_id', $student->id)->update(['note' => '[dianonimkan]']);
                DB::table('meeting_bookings')->where('student_id', $student->id)->update(['topic' => '[dianonimkan]']);
                $guardianIds = array_merge($guardianIds, $student->guardians()->pluck('guardians.id')->all());
            });
        }

        $guardians = 0;
        foreach (Guardian::withTrashed()->whereIn('id', array_unique($guardianIds))->get() as $guardian) {
            $stillHere = $guardian->students()->where('student_no', 'not like', 'ANON-%')->exists();
            if ($stillHere) {
                continue;
            }
            DB::transaction(function () use ($guardian) {
                if ($user = $guardian->user()->withTrashed()->first()) {
                    $user->forceFill([
                        'name' => 'Penjaga dianonimkan #'.$guardian->id,
                        'email' => null, 'phone' => null, 'ic_hash' => null, 'ic_encrypted' => null,
                        'is_active' => false,
                    ])->save();
                    $user->delete();
                }
                $guardian->forceFill([
                    'name' => 'Penjaga dianonimkan #'.$guardian->id,
                    'ic_hash' => null, 'ic_encrypted' => null, 'phone' => null, 'email' => null,
                    'address' => null, 'occupation' => null,
                ])->save();
            });
            $guardians++;
        }

        AuditLog::record('retention.anonymised', null, null, ['students' => $students->count(), 'guardians' => $guardians, 'cutoff' => $cutoff]);
        $this->info("Anonymised {$students->count()} student(s) and {$guardians} guardian(s) (left on or before {$cutoff}).");

        return self::SUCCESS;
    }
}
