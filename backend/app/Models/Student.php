<?php

namespace App\Models;

use App\Enums\StudentStatus;
use App\Support\Identity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['student_no', 'name', 'date_of_birth', 'gender', 'race', 'religion', 'is_citizen', 'status', 'enrolled_on', 'left_on'])]
#[Hidden(['ic_hash', 'ic_encrypted', 'photo_path'])]
class Student extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => StudentStatus::class,
            'date_of_birth' => 'date',
            'enrolled_on' => 'date',
            'left_on' => 'date',
            'is_citizen' => 'boolean',
            'ic_encrypted' => 'encrypted',
        ];
    }

    public function setIc(?string $ic): static
    {
        $this->ic_encrypted = Identity::normalizeIc($ic);
        $this->ic_hash = Identity::hashIc($ic);

        return $this;
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('status', StudentStatus::Active);
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class)
            ->withPivot(['relationship', 'is_primary', 'can_view'])
            ->withTimestamps();
    }

    public function enrolments(): HasMany
    {
        return $this->hasMany(Enrolment::class);
    }

    public function currentEnrolment(): HasOne
    {
        return $this->hasOne(Enrolment::class)->where('is_current', true)->latestOfMany('starts_on');
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'student_subjects')
            ->withPivot('academic_year_id')
            ->withTimestamps();
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function targets(): HasMany
    {
        return $this->hasMany(Target::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function absenceNotices(): HasMany
    {
        return $this->hasMany(AbsenceNotice::class);
    }

    public function interventions(): HasMany
    {
        return $this->hasMany(Intervention::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(StudentActivity::class);
    }
}
