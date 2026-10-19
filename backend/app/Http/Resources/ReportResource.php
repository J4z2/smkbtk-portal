<?php

namespace App\Http\Resources;

use App\Models\Report;
use App\Services\Coex;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Report */
class ReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $marks = $this->whenLoaded('marks');
        $values = $this->relationLoaded('marks') ? $this->marks->pluck('mark')->all() : [];

        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'class_id' => $this->class_id,
            'assessment' => [
                'id' => $this->assessment->id,
                'key' => $this->assessment->key,
                'name' => $this->assessment->name_ms,
                'name_en' => $this->assessment->name_en,
                'exam_date' => $this->assessment->exam_date?->toDateString(),
                'year' => $this->assessment->academicYear->year,
            ],
            'status' => $this->status->value,
            'average' => Coex::average($values),
            'teacher_comment' => $this->teacher_comment,
            'support_note' => $this->support_note,
            'discipline_note' => $this->discipline_note,
            'co_score' => $this->co_score,
            'attendance_rate' => $this->attendance_rate,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'approved_at' => $this->approved_at?->toIso8601String(),
            'published_at' => $this->published_at?->toIso8601String(),
            'parent_acknowledged_at' => $this->parent_acknowledged_at?->toIso8601String(),
            'marks' => MarkResource::collection($marks),
        ];
    }
}
