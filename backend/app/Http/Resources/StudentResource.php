<?php

namespace App\Http\Resources;

use App\Models\Student;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Student */
class StudentResource extends JsonResource
{
    /**
     * Sensitive fields (IC, race, religion, citizenship) only for users
     * allowed to see them.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $class = $this->currentEnrolment?->schoolClass;

        return [
            'id' => $this->id,
            'student_no' => $this->student_no,
            'name' => $this->name,
            'gender' => $this->gender,
            'status' => $this->status->value,
            'has_photo' => $this->photo_path !== null,
            'class' => $class ? [
                'id' => $class->id,
                'name' => $class->name,
                'code' => $class->code,
                'form' => $class->form,
                'form6_stage' => $class->form6_stage,
            ] : null,
            $this->mergeWhen($user && Access::canSeeSensitive($user, $this->resource), fn () => [
                'ic' => $this->ic_encrypted,
                'date_of_birth' => $this->date_of_birth?->toDateString(),
                'race' => $this->race,
                'religion' => $this->religion,
                'is_citizen' => $this->is_citizen,
            ]),
            $this->mergeWhen($user?->role->isStaff(), fn () => [
                'guardians' => $this->guardians->map(fn ($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                    'phone' => $g->phone,
                    'email' => $g->email,
                    'relationship' => $g->pivot->relationship,
                    'is_primary' => (bool) $g->pivot->is_primary,
                    'has_login' => $g->user_id !== null,
                ]),
            ]),
        ];
    }
}
