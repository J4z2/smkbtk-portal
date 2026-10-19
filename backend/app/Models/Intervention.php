<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'subject_id', 'type', 'owner_id', 'follow_up_on', 'note', 'status', 'resolved_at', 'created_by'])]
class Intervention extends Model
{
    protected function casts(): array
    {
        return [
            'follow_up_on' => 'date',
            'resolved_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
