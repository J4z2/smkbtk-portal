<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;
use App\Support\Access;

class StudentPolicy
{
    public function view(User $user, Student $student): bool
    {
        return Access::canSeeStudent($user, $student);
    }

    /**
     * Profile details, class moves, archive: admin only.
     */
    public function manage(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Daily attendance: the student's class teacher or an admin.
     */
    public function recordAttendance(User $user, Student $student): bool
    {
        return $user->role->isStaff() && Access::canSeeStudent($user, $student);
    }
}
