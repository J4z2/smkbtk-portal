<?php

namespace App\Support;

use App\Enums\Role;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * The single place that decides which students and classes a user may see.
 */
class Access
{
    /**
     * Students the user may see.
     *
     * @return Builder<Student>
     */
    public static function students(User $user): Builder
    {
        $query = Student::query();

        return match ($user->role) {
            Role::Parent => $query->whereHas('guardians', fn (Builder $g) => $g
                ->where('guardians.user_id', $user->id)
                ->where('guardian_student.can_view', true)),
            Role::ClassTeacher => $query->whereHas('enrolments', fn (Builder $e) => $e
                ->where('is_current', true)
                ->whereIn('class_id', self::taughtClassIds($user))),
            Role::Admin, Role::SuperAdmin => $query,
        };
    }

    public static function canSeeStudent(User $user, Student $student): bool
    {
        return self::students($user)->whereKey($student->getKey())->exists();
    }

    /**
     * Classes the user is class teacher of in the current year.
     *
     * @return array<int, int>
     */
    public static function taughtClassIds(User $user): array
    {
        if ($user->role !== Role::ClassTeacher) {
            return [];
        }

        return SchoolClass::where('class_teacher_id', $user->id)
            ->where('academic_year_id', AcademicYear::current()?->id)
            ->pluck('id')
            ->all();
    }

    public static function canManageClass(User $user, SchoolClass $class): bool
    {
        return $user->isAdmin() || in_array($class->id, self::taughtClassIds($user), true);
    }

    /**
     * Race, religion, citizenship and IC: admins, and the class teacher for their own class.
     */
    public static function canSeeSensitive(User $user, Student $student): bool
    {
        return $user->isAdmin()
            || ($user->role === Role::ClassTeacher && self::canSeeStudent($user, $student));
    }
}
