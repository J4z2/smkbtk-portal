<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FormSubject;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Subjects and which forms take them. Removing a subject from a form
 * never deletes marks already entered: they stay on their reports.
 */
class SubjectController extends Controller
{
    private const BANDS = ['lower' => [1, 2, 3], 'upper' => [4, 5], 'form6' => [6], 'all' => [1, 2, 3, 4, 5, 6]];

    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $data = $request->validate([
            'name_ms' => ['required', 'string', 'max:100'],
            'name_en' => ['nullable', 'string', 'max:100'],
            'code' => ['nullable', 'string', 'max:20', 'regex:/^[A-Za-z0-9_-]+$/'],
            'band' => ['required', Rule::in(array_keys(self::BANDS))],
        ]);
        $subject = Subject::where('name_ms', $data['name_ms'])->first()
            ?? Subject::create([
                'name_ms' => $data['name_ms'],
                'name_en' => $data['name_en'] ?? $data['name_ms'],
                'code' => $data['code'] ?? $this->uniqueCode($data['name_ms']),
            ]);
        foreach (self::BANDS[$data['band']] as $form) {
            FormSubject::firstOrCreate(['subject_id' => $subject->id, 'form' => $form]);
        }
        AuditLog::record('subject.created', $subject, null, $data);

        return response()->json($subject, 201);
    }

    public function removeFromBand(Request $request, Subject $subject): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $data = $request->validate(['band' => ['required', Rule::in(array_keys(self::BANDS))]]);
        FormSubject::where('subject_id', $subject->id)->whereIn('form', self::BANDS[$data['band']])->delete();
        AuditLog::record('subject.removed', $subject, null, $data);

        return response()->json(['ok' => true]);
    }

    private function uniqueCode(string $name): string
    {
        $base = Str::upper(Str::limit(preg_replace('/[^A-Za-z0-9]/', '', Str::ascii($name)), 8, ''));
        $code = $base ?: 'SUB';
        for ($i = 2; Subject::where('code', $code)->exists(); $i++) {
            $code = $base.$i;
        }

        return $code;
    }
}
