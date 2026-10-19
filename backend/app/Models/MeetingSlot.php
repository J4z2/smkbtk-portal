<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['class_id', 'teacher_id', 'date', 'starts_at', 'ends_at', 'capacity'])]
class MeetingSlot extends Model
{
    protected function casts(): array
    {
        return ['date' => 'date'];
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(MeetingBooking::class);
    }
}
