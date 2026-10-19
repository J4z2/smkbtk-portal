<?php

namespace App\Services\Import;

use App\Models\AcademicYear;
use App\Models\Enrolment;
use App\Models\Guardian;
use App\Models\ImportBatch;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Support\Identity;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

/**
 * Imports students and guardians from a CSV with a header row.
 *
 * Columns (Malay headings, any order; only nama, kelas and jantina are required):
 * nama, no_pelajar, ic, kelas, jantina, tarikh_lahir, kaum, agama, warganegara,
 * penjaga, ic_penjaga, telefon_penjaga, emel_penjaga, hubungan
 *
 * Existing students are matched by no_pelajar, then IC, and updated.
 * Guardians are matched by IC, so siblings share one guardian (and one login).
 */
class StudentImporter
{
    private const REQUIRED = ['nama', 'kelas', 'jantina'];

    /** @var array<string, SchoolClass> */
    private array $classes = [];

    public function import(string $path, string $fileName, ?int $userId): ImportBatch
    {
        $year = AcademicYear::current();
        $this->classes = SchoolClass::where('academic_year_id', $year?->id)->get()
            ->keyBy(fn ($c) => Str::upper($c->code))->all();

        $batch = ImportBatch::create(['type' => 'students', 'file_name' => $fileName, 'uploaded_by' => $userId]);
        $errors = [];
        $imported = 0;
        $rows = $this->rows($path);
        $header = array_shift($rows) ?? [];
        $missing = array_diff(self::REQUIRED, $header);
        if ($missing) {
            $batch->update(['status' => 'failed', 'errors' => [['row' => 1, 'error' => 'Lajur tiada: '.implode(', ', $missing)]]]);

            return $batch;
        }

        foreach ($rows as $i => $values) {
            $line = $i + 2;
            $row = array_combine($header, array_pad(array_slice($values, 0, count($header)), count($header), ''));
            try {
                $error = $this->importRow($row, $year);
            } catch (Throwable $e) {
                report($e);
                $error = 'Ralat sistem semasa menyimpan baris ini.';
            }
            if ($error) {
                $errors[] = ['row' => $line, 'error' => $error];
            } else {
                $imported++;
            }
        }

        $batch->update([
            'rows_total' => count($rows),
            'rows_imported' => $imported,
            'rows_skipped' => count($errors),
            'errors' => $errors,
            'status' => 'done',
        ]);

        return $batch;
    }

    /**
     * @param  array<string, string>  $row
     */
    private function importRow(array $row, ?AcademicYear $year): ?string
    {
        $name = trim($row['nama'] ?? '');
        $class = $this->classes[Str::upper(trim($row['kelas'] ?? ''))] ?? null;
        $gender = Str::upper(trim($row['jantina'] ?? ''));
        $gender = ['LELAKI' => 'L', 'PEREMPUAN' => 'P'][$gender] ?? $gender;
        $studentNo = trim($row['no_pelajar'] ?? '');

        if ($name === '') {
            return 'Nama kosong.';
        }
        if (! $class) {
            return 'Kod kelas "'.($row['kelas'] ?? '').'" tidak wujud untuk tahun semasa.';
        }
        if (! in_array($gender, ['L', 'P'], true)) {
            return 'Jantina mesti L atau P.';
        }
        if ($studentNo !== '' && ! preg_match('/^[A-Za-z0-9_-]{1,32}$/', $studentNo)) {
            return 'No pelajar hanya boleh mengandungi huruf, nombor, - dan _.';
        }

        DB::transaction(function () use ($row, $name, $class, $gender, $studentNo, $year) {
            $icHash = Identity::hashIc($row['ic'] ?? null);
            $student = ($studentNo !== '' ? Student::withTrashed()->where('student_no', $studentNo)->first() : null)
                ?? ($icHash ? Student::withTrashed()->where('ic_hash', $icHash)->first() : null)
                ?? new Student(['student_no' => $studentNo ?: 'TMP-'.Str::random(12)]);

            $student->fill(array_filter([
                'name' => $name,
                'gender' => $gender,
                'date_of_birth' => $this->date($row['tarikh_lahir'] ?? ''),
                'race' => $this->pick($row['kaum'] ?? '', ['melayu', 'cina', 'india', 'lain']),
                'religion' => $this->religion($row['agama'] ?? ''),
            ], fn ($v) => $v !== null));
            if (isset($row['warganegara']) && trim($row['warganegara']) !== '') {
                $student->is_citizen = ! in_array(Str::upper(trim($row['warganegara'])), ['N', 'TIDAK', 'BUKAN', 'MBWN'], true);
            }
            if ($icHash) {
                $student->setIc($row['ic']);
            }
            $student->save();
            if (str_starts_with($student->student_no, 'TMP-')) {
                $student->update(['student_no' => 'BTK'.($year?->year ?? now()->year).'-'.str_pad((string) $student->id, 4, '0', STR_PAD_LEFT)]);
            }

            $current = $student->enrolments()->where('is_current', true)->first();
            if (! $current || $current->class_id !== $class->id) {
                $student->enrolments()->where('is_current', true)->update(['is_current' => false, 'ends_on' => now()->toDateString()]);
                Enrolment::create(['student_id' => $student->id, 'class_id' => $class->id, 'academic_year_id' => $class->academic_year_id, 'starts_on' => now()->toDateString(), 'is_current' => true]);
            }

            $this->linkGuardian($student, $row);
        });

        return null;
    }

    /**
     * @param  array<string, string>  $row
     */
    private function linkGuardian(Student $student, array $row): void
    {
        $name = trim($row['penjaga'] ?? '');
        if ($name === '') {
            return;
        }
        $icHash = Identity::hashIc($row['ic_penjaga'] ?? null);
        $phone = Identity::normalizePhone($row['telefon_penjaga'] ?? null);
        $guardian = ($icHash ? Guardian::withTrashed()->where('ic_hash', $icHash)->first() : null)
            ?? $student->guardians()->where('name', $name)->first()
            ?? new Guardian(['name' => $name]);
        $guardian->fill(array_filter([
            'name' => $name,
            'phone' => $phone,
            'email' => ($email = trim($row['emel_penjaga'] ?? '')) !== '' ? strtolower($email) : null,
        ]));
        if ($icHash) {
            $guardian->setIc($row['ic_penjaga']);
        }
        $guardian->save();
        $relationship = $this->pick($row['hubungan'] ?? '', ['bapa', 'ibu', 'penjaga']) ?? 'penjaga';
        $student->guardians()->syncWithoutDetaching([$guardian->id => [
            'relationship' => $relationship,
            'is_primary' => $student->guardians()->count() === 0,
        ]]);
    }

    /**
     * @return array<int, array<int, string>>
     */
    private function rows(string $path): array
    {
        $handle = fopen($path, 'r');
        $rows = [];
        $first = true;
        while (($values = fgetcsv($handle, 0, ',', '"', '')) !== false) {
            if ($values === [null] || implode('', $values) === '') {
                continue;
            }
            if ($first) {
                // Header: strip a BOM, lower-case, spaces to underscores.
                $values = array_map(fn ($h) => Str::of($h)->replace("\u{FEFF}", '')->trim()->lower()->replace(' ', '_')->toString(), $values);
                $first = false;
            }
            $rows[] = array_map(fn ($v) => trim((string) $v), $values);
        }
        fclose($handle);

        return $rows;
    }

    private function pick(string $value, array $allowed): ?string
    {
        $value = Str::lower(trim($value));

        return in_array($value, $allowed, true) ? $value : null;
    }

    private function religion(string $value): ?string
    {
        $value = Str::lower(trim($value));
        if ($value === '') {
            return null;
        }

        return $value === 'islam' ? 'islam' : 'bukan_islam';
    }

    private function date(string $value): ?string
    {
        foreach (['Y-m-d', 'd/m/Y', 'd-m-Y'] as $format) {
            $date = \DateTime::createFromFormat('!'.$format, trim($value));
            if ($date) {
                return $date->format('Y-m-d');
            }
        }

        return null;
    }
}
