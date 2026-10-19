<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['report_id', 'subject_id', 'mark', 'is_absent', 'entered_by'])]
class Mark extends Model
{
    protected function casts(): array
    {
        return [
            'mark' => 'integer',
            'gear' => 'integer',
            'is_absent' => 'boolean',
        ];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
