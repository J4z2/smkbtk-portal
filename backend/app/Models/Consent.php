<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'privacy_notice_id', 'accepted_at', 'ip_address'])]
class Consent extends Model
{
    protected function casts(): array
    {
        return ['accepted_at' => 'datetime'];
    }
}
