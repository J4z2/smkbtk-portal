<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'name_ms', 'name_en', 'is_active'])]
class Subject extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function forms(): HasMany
    {
        return $this->hasMany(FormSubject::class);
    }
}
