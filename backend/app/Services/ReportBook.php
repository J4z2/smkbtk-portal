<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\FormSubject;
use App\Models\Mark;
use App\Models\Report;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Creates the report and blank mark rows a class needs for an assessment.
 */
class ReportBook
{
    /**
     * @return Collection<int, Report>
     */
    public function forClass(SchoolClass $class, Assessment $assessment): Collection
    {
        $students = $class->students()->orderBy('name')->get();

        return DB::transaction(fn () => $students->map(fn (Student $s) => $this->forStudent($s, $class, $assessment)));
    }

    public function forStudent(Student $student, SchoolClass $class, Assessment $assessment): Report
    {
        $report = Report::firstOrCreate(
            ['student_id' => $student->id, 'assessment_id' => $assessment->id],
            ['class_id' => $class->id],
        );
        $existing = $report->marks()->pluck('subject_id')->all();
        foreach (array_diff($this->subjectIds($student, $class), $existing) as $subjectId) {
            Mark::create(['report_id' => $report->id, 'subject_id' => $subjectId]);
        }

        return $report;
    }

    /**
     * The student's own subjects for the year, or the form's defaults.
     *
     * @return array<int, int>
     */
    public function subjectIds(Student $student, SchoolClass $class): array
    {
        $own = DB::table('student_subjects')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $class->academic_year_id)
            ->pluck('subject_id')
            ->all();

        return $own ?: FormSubject::where('form', $class->form)->pluck('subject_id')->all();
    }
}
