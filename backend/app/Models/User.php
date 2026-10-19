<?php

namespace App\Models;

use App\Enums\Role;
use App\Support\Identity;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'role', 'email', 'phone', 'password', 'must_change_password', 'is_active', 'locale'])]
#[Hidden(['password', 'remember_token', 'ic_hash', 'ic_encrypted'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * Same defaults as the database, so new models have them before a reload.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_active' => true,
        'must_change_password' => true,
        'locale' => 'ms',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => Role::class,
            'password' => 'hashed',
            'ic_encrypted' => 'encrypted',
            'must_change_password' => 'boolean',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Set the IC number: stores the encrypted value and the lookup hash.
     */
    public function setIc(?string $ic): static
    {
        $this->ic_encrypted = Identity::normalizeIc($ic);
        $this->ic_hash = Identity::hashIc($ic);

        return $this;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = Identity::normalizePhone($phone);

        return $this;
    }

    public function guardian(): HasOne
    {
        return $this->hasOne(Guardian::class);
    }

    /**
     * Classes this user teaches (one per year at most).
     */
    public function classes(): HasMany
    {
        return $this->hasMany(SchoolClass::class, 'class_teacher_id');
    }

    public function isAdmin(): bool
    {
        return $this->role->isAdmin();
    }
}
