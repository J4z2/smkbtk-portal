<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Services\Coex;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    private function payload(array $override = []): array
    {
        return array_merge(['lms_pass_mark' => 45, 'credit_gear' => 5, 'purple_gear' => 10, 'rules' => Coex::defaultRules()], $override);
    }

    public function test_super_admin_updates_coex_and_bad_ranges_are_rejected(): void
    {
        $this->actingAs($this->admin)->putJson('/api/admin/settings/coex', $this->payload())->assertForbidden();

        $this->actingAs($this->superAdmin)->putJson('/api/admin/settings/coex', $this->payload())->assertOk();
        $this->getJson('/api/bootstrap')->assertJsonPath('coex.lms_pass_mark', 45);

        $rules = Coex::defaultRules();
        $rules[0]['max_mark'] = 30;
        $this->putJson('/api/admin/settings/coex', $this->payload(['rules' => $rules]))->assertStatus(422);
        $this->assertTrue(AuditLog::where('action', 'settings.coex_updated')->exists());
    }

    public function test_school_contact_details(): void
    {
        $this->actingAs($this->superAdmin)->putJson('/api/admin/settings/school', ['name' => 'SMK Bandar Tasik Kesuma', 'phone' => '06-000 0000'])->assertOk();
        $this->actingAs($this->parent)->getJson('/api/bootstrap')->assertJsonPath('school.phone', '06-000 0000')->assertJsonCount(0, 'classes');
    }
}
