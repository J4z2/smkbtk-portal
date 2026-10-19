<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Services\ReportBook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccessTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    public function test_parent_sees_only_own_child(): void
    {
        $this->actingAs($this->parent);
        $this->getJson('/api/students')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Ali');
        $this->getJson("/api/students/{$this->studentA->id}")->assertOk();
        $this->getJson("/api/students/{$this->studentB->id}")->assertForbidden();
    }

    public function test_parent_never_sees_unpublished_reports_or_sensitive_fields(): void
    {
        $report = app(ReportBook::class)->forStudent($this->studentA, $this->classA, $this->trial());
        $this->actingAs($this->parent);

        $this->getJson("/api/students/{$this->studentA->id}/reports")->assertOk()->assertJsonCount(0, 'data');
        $this->getJson("/api/reports/{$report->id}")->assertForbidden();
        $this->getJson("/api/students/{$this->studentA->id}")->assertJsonMissingPath('data.race')->assertJsonMissingPath('data.guardians');

        $report->forceFill(['status' => 'published'])->save();
        $this->getJson("/api/students/{$this->studentA->id}/reports")->assertJsonCount(1, 'data');
        $this->getJson("/api/reports/{$report->id}")->assertOk();
    }

    public function test_guardian_link_can_be_blocked(): void
    {
        $this->guardian->students()->updateExistingPivot($this->studentA->id, ['can_view' => false]);
        $this->actingAs($this->parent)->getJson("/api/students/{$this->studentA->id}")->assertForbidden();
    }

    public function test_teacher_sees_only_own_class(): void
    {
        $this->actingAs($this->teacherA);
        $this->getJson('/api/students')->assertJsonCount(1, 'data')->assertJsonPath('data.0.race', 'melayu');
        $this->getJson("/api/students/{$this->studentB->id}")->assertForbidden();
        $this->getJson("/api/classes/{$this->classB->id}/reports?assessment_id={$this->trial()->id}")->assertForbidden();
        $this->getJson("/api/classes/{$this->classB->id}/attendance?date=2026-06-01")->assertForbidden();
        $this->getJson('/api/bootstrap')->assertOk()->assertJsonCount(1, 'classes');
    }

    public function test_admin_sees_everything_and_teacher_cannot_manage_students(): void
    {
        $this->actingAs($this->admin)->getJson('/api/students')->assertJsonCount(2, 'data');
        $this->getJson('/api/bootstrap')->assertJsonCount(2, 'classes');

        $this->actingAs($this->teacherA)->patchJson("/api/students/{$this->studentA->id}", ['name' => 'X'])->assertForbidden();
        $this->actingAs($this->parent)->getJson('/api/admin/audit-logs')->assertForbidden();
    }

    public function test_moving_class_moves_teacher_access(): void
    {
        $this->actingAs($this->admin)->postJson("/api/students/{$this->studentA->id}/move", ['class_id' => $this->classB->id, 'reason' => 'Pertukaran'])->assertOk();

        $this->actingAs($this->teacherA)->getJson("/api/students/{$this->studentA->id}")->assertForbidden();
        $this->actingAs($this->teacherB)->getJson("/api/students/{$this->studentA->id}")->assertOk();
        $this->assertSame(2, $this->studentA->enrolments()->count());
    }

    public function test_reports_are_created_for_the_whole_class(): void
    {
        $this->actingAs($this->teacherA)
            ->getJson("/api/classes/{$this->classA->id}/reports?assessment_id={$this->trial()->id}")
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonCount(6, 'data.0.marks');
        $this->assertSame(1, Report::count());
    }
}
