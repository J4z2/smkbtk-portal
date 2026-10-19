<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['meeting_slot_id', 'student_id', 'booked_by', 'topic', 'status'])]
class MeetingBooking extends Model
{
    public function slot(): BelongsTo
    {
        return $this->belongsTo(MeetingSlot::class, 'meeting_slot_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
