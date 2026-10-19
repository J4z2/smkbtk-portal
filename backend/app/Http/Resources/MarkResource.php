<?php

namespace App\Http\Resources;

use App\Models\Mark;
use App\Services\Coex;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Mark */
class MarkResource extends JsonResource
{
    /**
     * Published marks use the frozen grade; drafts are graded live.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $coex = app(Coex::class);
        $rule = $this->mark === null ? null : $coex->ruleFor($this->mark);

        return [
            'subject_id' => $this->subject_id,
            'subject_code' => $this->subject->code,
            'subject' => $this->subject->name_ms,
            'subject_en' => $this->subject->name_en,
            'mark' => $this->mark,
            'is_absent' => $this->is_absent,
            'grade' => $this->grade ?? ($rule ? Coex::displayGrade($rule->grade) : null),
            'gear' => $this->gear ?? $rule?->gear,
        ];
    }
}
