<?php

namespace App\Models;

use App\Enums\Role;
use App\Support\Access;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title_ms', 'title_en', 'body_ms', 'body_en', 'category', 'audience', 'audience_value', 'published_at', 'created_by'])]
class Announcement extends Model
{
    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    /**
     * Staff see every announcement. Parents see published ones aimed at
     * everyone, or at a form or class one of their children is in.
     *
     * @return Builder<self>
     */
    public static function visibleTo(User $user): Builder
    {
        $query = static::query()->latest('published_at')->latest('id');
        if ($user->role !== Role::Parent) {
            return $query;
        }
        $classes = Access::students($user)->with('currentEnrolment.schoolClass')->get()
            ->map(fn ($s) => $s->currentEnrolment?->schoolClass)->filter();

        return $query->whereNotNull('published_at')->where('published_at', '<=', now())
            ->where(fn ($q) => $q->where('audience', 'all')
                ->orWhere(fn ($f) => $f->where('audience', 'form')->whereIn('audience_value', $classes->pluck('form')->map(fn ($f) => (string) $f)))
                ->orWhere(fn ($c) => $c->where('audience', 'class')->whereIn('audience_value', $classes->pluck('id')->map(fn ($id) => (string) $id))));
    }
}
