<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['academic_year_id', 'form', 'key', 'name_ms', 'name_en', 'exam_date', 'sort_order', 'is_current', 'is_open'])]
class Assessment extends Model
{
    protected function casts(): array
    {
        return [
            'exam_date' => 'date',
            'is_current' => 'boolean',
            'is_open' => 'boolean',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
