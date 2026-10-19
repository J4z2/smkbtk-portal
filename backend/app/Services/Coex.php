<?php

namespace App\Services;

use App\Models\CoexRule;
use App\Models\Setting;
use Illuminate\Support\Collection;
use InvalidArgumentException;

/**
 * COEx grading: turns marks into grade, Gear and zone using the rules table.
 */
class Coex
{
    /** @var Collection<int, CoexRule>|null */
    private ?Collection $rules = null;

    /**
     * @return Collection<int, CoexRule>
     */
    public function rules(): Collection
    {
        return $this->rules ??= CoexRule::orderBy('min_mark')->get();
    }

    public function forget(): void
    {
        $this->rules = null;
    }

    public function ruleFor(int $mark): CoexRule
    {
        $mark = max(0, min(100, $mark));

        return $this->rules()->first(fn (CoexRule $r) => $mark >= $r->min_mark && $mark <= $r->max_mark)
            ?? $this->rules()->last();
    }

    /**
     * Marks 0–39 show as a single "G", even if a rule calls them G1/G2.
     */
    public static function displayGrade(string $grade): string
    {
        return preg_match('/^G\d*$/', $grade) ? 'G' : $grade;
    }

    public function gradeFor(int $mark): string
    {
        return self::displayGrade($this->ruleFor($mark)->grade);
    }

    /**
     * Same tiers as the prototype's suggested target.
     */
    public static function suggestedTarget(int $current): int
    {
        $target = match (true) {
            $current < 40 => 50,
            $current < 55 => 65,
            $current < 70 => 80,
            $current < 85 => 90,
            default => 95,
        };

        return max($current, $target);
    }

    /**
     * @param  array<int|string, int|null>  $marks
     */
    public static function average(array $marks): ?int
    {
        $values = array_filter($marks, fn ($m) => $m !== null);

        return $values ? (int) round(array_sum($values) / count($values)) : null;
    }

    /**
     * LMS (Layak Mendapat Sijil): BM and Sejarah at or above the pass mark.
     * Only applies to Forms 4 and 5.
     *
     * @param  array<string, int|null>  $marksBySubjectCode
     * @return array{applicable: bool, eligible: bool|null, bm: int|null, sejarah: int|null, pass_mark: int}
     */
    public function lms(int $form, array $marksBySubjectCode): array
    {
        $pass = (int) Setting::get('coex.lms_pass_mark', 40);
        $bm = $marksBySubjectCode[config('portal.subjects.bm')] ?? null;
        $sej = $marksBySubjectCode[config('portal.subjects.sejarah')] ?? null;
        $applicable = in_array($form, [4, 5], true);

        return [
            'applicable' => $applicable,
            'eligible' => $applicable && $bm !== null && $sej !== null ? ($bm >= $pass && $sej >= $pass) : null,
            'bm' => $bm,
            'sejarah' => $sej,
            'pass_mark' => $pass,
        ];
    }

    /**
     * Check a full rule set before saving: Gears 1–11, ranges joined end to
     * end from 0 to 100 with no gaps or overlaps, and a grade on each.
     *
     * @param  array<int, array<string, mixed>>  $rules
     *
     * @throws InvalidArgumentException
     */
    public static function validateRules(array $rules): void
    {
        usort($rules, fn ($a, $b) => $a['gear'] <=> $b['gear']);
        if (array_column($rules, 'gear') !== range(1, 11)) {
            throw new InvalidArgumentException('Peraturan mesti mempunyai Gear 1 hingga 11.');
        }
        $expected = 0;
        foreach ($rules as $r) {
            if ((int) $r['min_mark'] !== $expected || (int) $r['max_mark'] < (int) $r['min_mark'] || trim((string) $r['grade']) === '') {
                throw new InvalidArgumentException("Julat Gear {$r['gear']} tidak sah.");
            }
            $expected = (int) $r['max_mark'] + 1;
        }
        if ($expected !== 101) {
            throw new InvalidArgumentException('Julat Gear 11 mesti berakhir pada 100.');
        }
    }

    /**
     * Default rules from the prototype (client COEx document).
     *
     * @return array<int, array<string, mixed>>
     */
    public static function defaultRules(): array
    {
        $rows = [
            [1, 0, 25, 'G', 'Zon Kritikal', 'Belum Bersedia Belajar', '#000000', 'Intervensi individu, kelas pemulihan, libat urus ibu bapa dan pemantauan rapi.'],
            [2, 26, 39, 'G', 'Zon Risiko', 'Bersedia Belajar', '#ff0000', 'Bimbingan berfokus, latihan asas, pemantauan berkala dan motivasi berterusan.'],
            [3, 40, 44, 'E', 'Zon Pemulihan', 'Fokus Pembelajaran', '#833c0b', 'Pengukuhan konsep asas, latihan mengikut topik dan pentaksiran formatif.'],
            [4, 45, 49, 'D', 'Zon Perkembangan', 'Memahami Asas', '#ff9900', 'Latihan pengukuhan, sasaran lulus dan peningkatan markah.'],
            [5, 50, 54, 'C', 'Zon Penguasaan', 'Penglibatan Aktif', '#00b0f0', 'Pengayaan, latihan KBAT asas dan pengekalan prestasi.'],
            [6, 55, 59, 'C+', 'Zon Penguasaan', 'Menguasai Pembelajaran', '#0070c0', 'Latihan berpandu, pengayaan dan peningkatan konsisten.'],
            [7, 60, 64, 'B', 'Zon Kecemerlangan', 'Konsisten Cemerlang', '#91d050', 'Latihan pengayaan, teknik menjawab, analisis kesilapan dan latihan topikal aras tinggi.'],
            [8, 65, 69, 'B+', 'Zon Kecemerlangan', 'Pembelajaran Kendiri', '#00b050', 'Mantapkan pembelajaran kendiri, latihan aras tinggi dan sasaran gred A.'],
            [9, 70, 79, 'A-', 'Zon Ikon', 'Inisiatif Kecemerlangan', '#cc66ff', 'Latih tubi soalan sebenar SPM, bedah kertas, analisis skema dan simulasi peperiksaan.'],
            [10, 80, 89, 'A', 'Zon Ikon', 'Pemimpin Pembelajaran', '#cc66ff', 'Strategi berimpak tinggi untuk meningkatkan A kepada A+ dan membimbing rakan.'],
            [11, 90, 100, 'A+', 'Zon Ikon', 'Pencinta Ilmu', '#7030a0', 'Program Pecutan A+, latihan KBAT aras tinggi, analisis kesilapan dan simulasi SPM.'],
        ];

        return array_map(fn ($r) => [
            'gear' => $r[0], 'min_mark' => $r[1], 'max_mark' => $r[2], 'grade' => $r[3],
            'zone' => $r[4], 'level' => $r[5], 'color' => $r[6], 'action_ms' => $r[7],
        ], $rows);
    }
}
