<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title_ms', 'title_en', 'body_ms', 'body_en', 'category', 'audience', 'audience_value', 'published_at', 'created_by'])]
class Announcement extends Model
{
    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }
}
