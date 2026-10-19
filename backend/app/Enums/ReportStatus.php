<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Approved = 'approved';
    case Published = 'published';

    /**
     * Teachers may change marks and comments only before submission.
     */
    public function isEditableByTeacher(): bool
    {
        return $this === self::Draft;
    }
}
