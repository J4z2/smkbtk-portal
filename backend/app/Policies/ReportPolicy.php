<?php

namespace App\Policies;

use App\Enums\ReportStatus;
use App\Enums\Role;
use App\Models\Report;
use App\Models\User;
use App\Support\Access;

class ReportPolicy
{
    /**
     * Parents see published reports only.
     */
    public function view(User $user, Report $report): bool
    {
        if (! Access::canSeeStudent($user, $report->student)) {
            return false;
        }

        return $user->role !== Role::Parent || $report->isPublished();
    }

    /**
     * Marks and comments: the class teacher while it is a draft and the
     * checkpoint is open, or an admin until it is published.
     */
    public function update(User $user, Report $report): bool
    {
        if ($user->isAdmin()) {
            return $report->status !== ReportStatus::Published;
        }

        return $user->role === Role::ClassTeacher
            && $report->status->isEditableByTeacher()
            && $report->assessment->is_open
            && in_array($report->class_id, Access::taughtClassIds($user), true);
    }

    public function submit(User $user, Report $report): bool
    {
        return $this->update($user, $report);
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin();
    }

    public function publish(User $user): bool
    {
        return $user->isAdmin();
    }

    public function acknowledge(User $user, Report $report): bool
    {
        return $user->role === Role::Parent && $this->view($user, $report);
    }
}
