<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['gear', 'min_mark', 'max_mark', 'grade', 'zone', 'level', 'action_ms', 'action_en', 'color'])]
class CoexRule extends Model
{
    protected function casts(): array
    {
        return [
            'gear' => 'integer',
            'min_mark' => 'integer',
            'max_mark' => 'integer',
        ];
    }
}
