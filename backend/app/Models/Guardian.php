<?php

namespace App\Models;

use App\Support\Identity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'name', 'phone', 'email', 'address', 'occupation'])]
#[Hidden(['ic_hash', 'ic_encrypted'])]
class Guardian extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return ['ic_encrypted' => 'encrypted'];
    }

    public function setIc(?string $ic): static
    {
        $this->ic_encrypted = Identity::normalizeIc($ic);
        $this->ic_hash = Identity::hashIc($ic);

        return $this;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class)
            ->withPivot(['relationship', 'is_primary', 'can_view'])
            ->withTimestamps();
    }
}
