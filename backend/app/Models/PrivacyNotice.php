<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['version', 'content_ms', 'content_en', 'published_at'])]
class PrivacyNotice extends Model
{
    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    /**
     * The notice parents must currently accept.
     */
    public static function current(): ?self
    {
        return static::whereNotNull('published_at')->latest('published_at')->first();
    }
}
