<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\CoexRule;
use App\Models\FormSubject;
use App\Models\PrivacyNotice;
use App\Models\Setting;
use App\Models\Subject;
use App\Services\Coex;
use Illuminate\Database\Seeder;

/**
 * Data the portal needs to run, safe for production and safe to re-run:
 * COEx rules, settings, subjects, the current year and its checkpoints,
 * and the draft privacy notice (unpublished).
 */
class ReferenceDataSeeder extends Seeder
{
    /**
     * Subjects per level, from the prototype. Admin can change these.
     */
    public const SUBJECTS = [
        'BM' => ['Bahasa Melayu', 'Malay Language', [1, 2, 3, 4, 5]],
        'BI' => ['Bahasa Inggeris', 'English Language', [1, 2, 3, 4, 5]],
        'MT' => ['Matematik', 'Mathematics', [1, 2, 3, 4, 5]],
        'SN' => ['Sains', 'Science', [1, 2, 3, 4, 5]],
        'SEJ' => ['Sejarah', 'History', [1, 2, 3, 4, 5, 6]],
        'GEO' => ['Geografi', 'Geography', [1, 2, 3, 6]],
        'RBT' => ['Reka Bentuk dan Teknologi', 'Design and Technology', [1, 2, 3]],
        'PI' => ['Pendidikan Islam', 'Islamic Education', [1, 2, 3, 4, 5]],
        'PA' => ['Pengajian Am', 'General Studies', [6]],
        'BMS' => ['Bahasa Melayu (STPM)', 'Malay Language (STPM)', [6]],
        'MUET' => ['MUET', 'MUET', [6]],
        'EKO' => ['Ekonomi', 'Economics', [6]],
    ];

    /**
     * Checkpoint names per form, matching the frontend's form profiles.
     *
     * @return array<string, array{0: string, 1: string}>
     */
    public static function checkpoints(int $form): array
    {
        return match (true) {
            $form <= 3 => [
                'tov' => ["Diagnostik Awal Tingkatan {$form}", "Form {$form} Initial Diagnostic"],
                'pat' => ["Pentaksiran Pertengahan Tingkatan {$form}", "Form {$form} Mid-Year Assessment"],
                'ppt' => ["Pentaksiran 2 Tingkatan {$form}", "Form {$form} Assessment 2"],
                'trial' => ["Pentaksiran Akhir Tingkatan {$form}", "Form {$form} Final Assessment"],
            ],
            $form === 4 => [
                'tov' => ['TOV Tingkatan 4', 'Form 4 TOV'],
                'pat' => ['PPT Tingkatan 4', 'Form 4 Mid-Year (PPT)'],
                'ppt' => ['Pentaksiran 2 Tingkatan 4', 'Form 4 Assessment 2'],
                'trial' => ['PAT Tingkatan 4', 'Form 4 Final (PAT)'],
            ],
            $form === 5 => [
                'tov' => ['PAT Tingkatan 4', 'Form 4 Final (PAT)'],
                'pat' => ['Diagnostik Tingkatan 5', 'Form 5 Diagnostic'],
                'ppt' => ['PPT Tingkatan 5', 'Form 5 Mid-Year (PPT)'],
                'trial' => ['Percubaan SPM', 'SPM Trial'],
                'final' => ['SPM sebenar', 'SPM'],
            ],
            default => [
                'tov' => ['Diagnostik Tingkatan 6', 'Form 6 Diagnostic'],
                'pat' => ['Semester 1', 'Semester 1'],
                'ppt' => ['Semester 2', 'Semester 2'],
                'trial' => ['Semester 3', 'Semester 3'],
                'final' => ['STPM sebenar', 'STPM'],
            ],
        };
    }

    public function run(): void
    {
        foreach (Coex::defaultRules() as $rule) {
            CoexRule::firstOrCreate(['gear' => $rule['gear']], $rule);
        }

        $defaults = [
            'school.name' => 'SMK Bandar Tasik Kesuma',
            'school.address' => '',
            'school.phone' => '',
            'school.email' => '',
            'school.office_hours' => 'Isnin hingga Jumaat, 8.00 pagi hingga 4.30 petang',
            'coex.lms_pass_mark' => 40,
            'coex.credit_gear' => 5,
            'coex.purple_gear' => 10,
        ];
        foreach ($defaults as $key => $value) {
            if (! Setting::where('key', $key)->exists()) {
                Setting::put($key, $value);
            }
        }

        foreach (self::SUBJECTS as $code => [$ms, $en, $forms]) {
            $subject = Subject::firstOrCreate(['code' => $code], ['name_ms' => $ms, 'name_en' => $en]);
            foreach ($forms as $form) {
                FormSubject::firstOrCreate(['subject_id' => $subject->id, 'form' => $form]);
            }
        }

        $year = AcademicYear::firstOrCreate(['year' => 2026], ['starts_on' => '2026-01-12', 'ends_on' => '2026-12-04']);
        if (! AcademicYear::where('is_current', true)->exists()) {
            $year->update(['is_current' => true]);
        }
        foreach (range(1, 6) as $form) {
            $order = 0;
            foreach (self::checkpoints($form) as $key => [$ms, $en]) {
                Assessment::firstOrCreate(
                    ['academic_year_id' => $year->id, 'form' => $form, 'key' => $key],
                    ['name_ms' => $ms, 'name_en' => $en, 'sort_order' => ++$order, 'is_current' => $key === 'trial', 'is_open' => $key === 'trial'],
                );
            }
        }

        PrivacyNotice::firstOrCreate(['version' => '2026-draft-1'], [
            'content_ms' => file_get_contents(resource_path('privacy/notice.ms.md')),
            'content_en' => file_get_contents(resource_path('privacy/notice.en.md')),
            'published_at' => null,
        ]);
    }
}
