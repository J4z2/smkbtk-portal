<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'activity_id', 'academic_year_id', 'role_or_detail', 'score', 'achievement'])]
class StudentActivity extends Model
{
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}
