<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\PrivacyNotice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    public function test_login_with_email_phone_or_ic(): void
    {
        $user = User::where('email', 'parent@test.my')->first();
        $user->setPhone('012-345 6789')->setIc('600505-10-5678');
        $user->save();

        foreach (['PARENT@test.my', '0123456789', '+60 12-345 6789', '600505105678', '600505-10-5678'] as $login) {
            $this->postJson('/api/login', ['login' => $login, 'password' => 'secret123'])
                ->assertOk()->assertJsonPath('role', 'parent');
            $this->postJson('/api/logout')->assertOk();
        }
    }

    public function test_wrong_password_and_inactive_accounts_are_refused(): void
    {
        $this->postJson('/api/login', ['login' => 'parent@test.my', 'password' => 'nope'])->assertStatus(422);

        User::where('email', 'parent@test.my')->update(['is_active' => false]);
        $this->postJson('/api/login', ['login' => 'parent@test.my', 'password' => 'secret123'])->assertStatus(422);
    }

    public function test_repeated_failures_are_throttled(): void
    {
        RateLimiter::clear('login:parent@test.my|127.0.0.1');
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', ['login' => 'parent@test.my', 'password' => 'nope'])->assertStatus(422);
        }
        $this->postJson('/api/login', ['login' => 'parent@test.my', 'password' => 'secret123'])->assertStatus(429);
    }

    public function test_one_time_password_must_be_changed_first(): void
    {
        $user = $this->makeUser(Role::ClassTeacher, 'new@test.my', 'TEMP1234');
        $user->update(['must_change_password' => true]);

        $this->actingAs($user)->getJson('/api/bootstrap')->assertStatus(403)->assertJsonPath('code', 'password_change_required');
        $this->postJson('/api/password', ['current_password' => 'TEMP1234', 'password' => 'baru12345', 'password_confirmation' => 'baru12345'])->assertOk();
        $this->getJson('/api/bootstrap')->assertOk();
    }

    public function test_parent_must_accept_published_privacy_notice(): void
    {
        $this->actingAs($this->parent)->getJson('/api/bootstrap')->assertOk();

        PrivacyNotice::first()->update(['published_at' => now()]);
        $this->getJson('/api/bootstrap')->assertStatus(403)->assertJsonPath('code', 'consent_required');
        $this->postJson('/api/privacy-notice/accept')->assertOk();
        $this->getJson('/api/bootstrap')->assertOk();

        // Staff are not asked.
        $this->actingAs($this->teacherA)->getJson('/api/bootstrap')->assertOk();
    }

    public function test_guests_get_401(): void
    {
        $this->getJson('/api/bootstrap')->assertStatus(401);
    }

    public function test_validation_messages_follow_the_chosen_language(): void
    {
        $this->postJson('/api/login', [], ['X-Locale' => 'ms'])->assertStatus(422)->assertJsonPath('errors.login.0', 'nama pengguna diperlukan.');
        $this->postJson('/api/login', [], ['X-Locale' => 'en'])->assertStatus(422)->assertJsonPath('errors.login.0', 'The login field is required.');
    }
}
