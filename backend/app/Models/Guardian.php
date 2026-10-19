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

    /**
     * The existing guardian this person is, if any: same IC, or (when no
     * IC is given) same phone and same name. Used so siblings share one
     * guardian record and one login.
     */
    public static function findMatch(?string $ic, ?string $phone, ?string $name): ?self
    {
        if ($hash = Identity::hashIc($ic)) {
            return static::where('ic_hash', $hash)->first();
        }
        $phone = Identity::normalizePhone($phone);
        if (! $phone || ! $name) {
            return null;
        }

        return static::where('phone', $phone)
            ->get()
            ->first(fn (self $g) => mb_strtolower(trim($g->name)) === mb_strtolower(trim($name)));
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
