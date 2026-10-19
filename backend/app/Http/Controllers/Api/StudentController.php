<?php

namespace App\Http\Controllers\Api;

use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\Enrolment;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentController extends Controller
{
    /**
     * Students the user may see. Parents get their own children.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $data = $request->validate([
            'class_id' => ['nullable', 'integer'],
            'status' => ['nullable', Rule::enum(StudentStatus::class)],
            'q' => ['nullable', 'string', 'max:100'],
        ]);
        $students = Access::students($request->user())
            ->with(['currentEnrolment.schoolClass', 'guardians'])
            ->when($data['class_id'] ?? null, fn ($q, $id) => $q->whereHas('enrolments', fn ($e) => $e->where('is_current', true)->where('class_id', $id)))
            ->when($data['status'] ?? 'active', fn ($q, $s) => $q->where('status', $s))
            ->when($data['q'] ?? null, fn ($q, $term) => $q->where(fn ($w) => $w->where('name', 'like', "%{$term}%")->orWhere('student_no', 'like', "%{$term}%")))
            ->orderBy('name')
            ->paginate(100);

        return StudentResource::collection($students);
    }

    public function show(Student $student): StudentResource
    {
        Gate::authorize('view', $student);

        return new StudentResource($student->load(['currentEnrolment.schoolClass', 'guardians']));
    }

    public function store(Request $request): StudentResource
    {
        Gate::authorize('manage', Student::class);
        $data = $this->validated($request);
        $student = DB::transaction(function () use ($data, $request) {
            $student = new Student($data);
            $student->student_no = $data['student_no'] ?? $this->nextStudentNo();
            $student->setIc($data['ic'] ?? null);
            $student->save();
            $this->enrol($student, SchoolClass::findOrFail($data['class_id']));
            AuditLog::record('student.created', $student, null, $request->except('ic'));

            return $student;
        });

        return new StudentResource($student->load(['currentEnrolment.schoolClass', 'guardians']));
    }

    public function update(Request $request, Student $student): StudentResource
    {
        Gate::authorize('manage', Student::class);
        $data = $this->validated($request, $student);
        $old = $student->only(array_keys($data));
        $student->fill($data);
        if (array_key_exists('ic', $data)) {
            $student->setIc($data['ic']);
        }
        $student->save();
        AuditLog::record('student.updated', $student, $old, collect($data)->except('ic')->all());

        return new StudentResource($student->load(['currentEnrolment.schoolClass', 'guardians']));
    }

    /**
     * Move to another class: closes the current enrolment and opens a new one.
     */
    public function move(Request $request, Student $student): StudentResource
    {
        Gate::authorize('manage', Student::class);
        $data = $request->validate([
            'class_id' => ['required', 'integer', 'exists:classes,id'],
            'reason' => ['required', 'string', 'max:255'],
        ]);
        $class = SchoolClass::findOrFail($data['class_id']);
        $from = $student->currentEnrolment?->schoolClass?->name;
        DB::transaction(fn () => $this->enrol($student, $class));
        AuditLog::record('student.moved', $student, ['class' => $from], ['class' => $class->name, 'reason' => $data['reason']]);

        return new StudentResource($student->fresh()->load(['currentEnrolment.schoolClass', 'guardians']));
    }

    public function setStatus(Request $request, Student $student): StudentResource
    {
        Gate::authorize('manage', Student::class);
        $data = $request->validate(['status' => ['required', Rule::enum(StudentStatus::class)]]);
        $old = $student->status->value;
        $student->status = $data['status'];
        $student->left_on = $data['status'] === StudentStatus::Active->value ? null : ($student->left_on ?? now());
        $student->save();
        AuditLog::record('student.status_changed', $student, ['status' => $old], ['status' => $data['status']]);

        return new StudentResource($student->load(['currentEnrolment.schoolClass', 'guardians']));
    }

    /**
     * Passport photo: JPG/PNG up to 2 MB, kept in private storage.
     */
    public function uploadPhoto(Request $request, Student $student): JsonResponse
    {
        Gate::authorize('manage', Student::class);
        $request->validate(['photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048']]);
        if ($student->photo_path) {
            Storage::disk('local')->delete($student->photo_path);
        }
        $student->photo_path = $request->file('photo')->store('photos', 'local');
        $student->save();
        AuditLog::record('student.photo_updated', $student);

        return response()->json(['ok' => true]);
    }

    public function photo(Student $student): StreamedResponse
    {
        Gate::authorize('view', $student);
        abort_unless($student->photo_path && Storage::disk('local')->exists($student->photo_path), 404);

        return Storage::disk('local')->response($student->photo_path, null, ['Cache-Control' => 'private, max-age=3600']);
    }

    private function enrol(Student $student, SchoolClass $class): void
    {
        Enrolment::where('student_id', $student->id)->where('is_current', true)
            ->update(['is_current' => false, 'ends_on' => now()->toDateString()]);
        Enrolment::create([
            'student_id' => $student->id,
            'class_id' => $class->id,
            'academic_year_id' => $class->academic_year_id,
            'starts_on' => now()->toDateString(),
            'is_current' => true,
        ]);
    }

    /**
     * BTK + year + running number, e.g. BTK2026-0001.
     */
    private function nextStudentNo(): string
    {
        $prefix = 'BTK'.(AcademicYear::current()?->year ?? now()->year).'-';
        $last = Student::withTrashed()->where('student_no', 'like', $prefix.'%')->orderByDesc('student_no')->value('student_no');
        $n = $last ? (int) substr($last, strlen($prefix)) + 1 : 1;

        return $prefix.str_pad((string) $n, 4, '0', STR_PAD_LEFT);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Student $student = null): array
    {
        $creating = $student === null;

        return $request->validate([
            'student_no' => ['nullable', 'string', 'max:32', 'regex:/^[A-Za-z0-9_-]+$/', Rule::unique('students', 'student_no')->ignore($student)],
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:150'],
            'ic' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => [$creating ? 'required' : 'sometimes', Rule::in(['L', 'P'])],
            'race' => ['nullable', Rule::in(['melayu', 'cina', 'india', 'lain'])],
            'religion' => ['nullable', Rule::in(['islam', 'bukan_islam'])],
            'is_citizen' => ['sometimes', 'boolean'],
            'enrolled_on' => ['nullable', 'date'],
            'class_id' => [$creating ? 'required' : 'prohibited', 'integer', 'exists:classes,id'],
        ]);
    }
}
