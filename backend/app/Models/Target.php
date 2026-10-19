<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'academic_year_id', 'subject_id', 'target_mark', 'set_by'])]
class Target extends Model
{
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
