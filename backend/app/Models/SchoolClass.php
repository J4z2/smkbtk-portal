<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

// "Class" is a reserved word in PHP, so the model is SchoolClass.
#[Table('classes')]
#[Fillable(['academic_year_id', 'form', 'form6_stage', 'name', 'code', 'is_dlp', 'session', 'class_teacher_id'])]
class SchoolClass extends Model
{
    protected function casts(): array
    {
        return ['is_dlp' => 'boolean'];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function classTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'class_teacher_id');
    }

    public function enrolments(): HasMany
    {
        return $this->hasMany(Enrolment::class, 'class_id');
    }

    /**
     * Students currently in this class.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'enrolments', 'class_id')
            ->wherePivot('is_current', true);
    }
}
