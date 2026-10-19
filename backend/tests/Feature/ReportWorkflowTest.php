<?php

namespace Tests\Feature;

use App\Models\CoexRule;
use App\Models\Report;
use App\Models\Subject;
use App\Services\ReportBook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportWorkflowTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    private Report $report;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
        $this->report = app(ReportBook::class)->forStudent($this->studentA, $this->classA, $this->trial());
    }

    private function marks(array $byCode): array
    {
        return collect($byCode)->map(fn ($mark, $code) => ['subject_id' => Subject::where('code', $code)->value('id'), 'mark' => $mark])->values()->all();
    }

    public function test_full_flow_from_teacher_to_parent(): void
    {
        $this->actingAs($this->teacherA)
            ->patchJson("/api/reports/{$this->report->id}", ['marks' => $this->marks(['BM' => 85, 'SEJ' => 30, 'MT' => null]), 'teacher_comment' => 'Baik'])
            ->assertOk()
            ->assertJsonPath('data.marks.0.grade', 'A')
            ->assertJsonPath('data.average', 58);

        $this->postJson("/api/reports/{$this->report->id}/submit")->assertOk()->assertJsonPath('data.status', 'submitted');
        // Teacher can no longer edit or approve.
        $this->patchJson("/api/reports/{$this->report->id}", ['teacher_comment' => 'X'])->assertForbidden();
        $this->postJson("/api/reports/{$this->report->id}/approve")->assertForbidden();

        $this->actingAs($this->admin);
        $this->postJson("/api/reports/{$this->report->id}/publish")->assertStatus(422);
        $this->postJson("/api/reports/{$this->report->id}/approve")->assertOk();
        $this->postJson("/api/reports/{$this->report->id}/publish")->assertOk()->assertJsonPath('data.status', 'published');

        $sej = $this->report->marks()->whereHas('subject', fn ($q) => $q->where('code', 'SEJ'))->first();
        $this->assertSame('G', $sej->grade);
        $this->assertSame(2, $sej->gear);

        $this->actingAs($this->parent)->getJson("/api/students/{$this->studentA->id}/reports")->assertJsonCount(1, 'data');
        $this->postJson("/api/reports/{$this->report->id}/acknowledge")->assertOk();
        $this->assertNotNull($this->report->fresh()->parent_acknowledged_at);
    }

    public function test_published_grades_do_not_change_when_rules_change(): void
    {
        $this->actingAs($this->teacherA)->patchJson("/api/reports/{$this->report->id}", ['marks' => $this->marks(['BM' => 85])]);
        $this->report->forceFill(['status' => 'approved'])->save();
        $this->actingAs($this->admin)->postJson("/api/reports/{$this->report->id}/publish")->assertOk();

        CoexRule::where('gear', 10)->update(['grade' => 'Z']);

        $this->getJson("/api/reports/{$this->report->id}")->assertJsonPath('data.marks.0.grade', 'A');
    }

    public function test_teacher_cannot_enter_marks_when_checkpoint_closed(): void
    {
        $this->trial()->update(['is_open' => false]);
        $this->actingAs($this->teacherA)->patchJson("/api/reports/{$this->report->id}", ['teacher_comment' => 'X'])->assertForbidden();
        $this->actingAs($this->admin)->patchJson("/api/reports/{$this->report->id}", ['teacher_comment' => 'X'])->assertOk();
    }

    public function test_other_class_teacher_cannot_edit(): void
    {
        $this->actingAs($this->teacherB)->patchJson("/api/reports/{$this->report->id}", ['teacher_comment' => 'X'])->assertForbidden();
    }

    public function test_marks_are_validated(): void
    {
        $this->actingAs($this->teacherA)
            ->patchJson("/api/reports/{$this->report->id}", ['marks' => [['subject_id' => Subject::where('code', 'BM')->value('id'), 'mark' => 120]]])
            ->assertStatus(422);
        $this->patchJson("/api/reports/{$this->report->id}", ['marks' => [['subject_id' => Subject::where('code', 'EKO')->value('id'), 'mark' => 50]]])
            ->assertStatus(422);
    }

    public function test_admin_returns_report_and_bulk_publishes_class(): void
    {
        $this->report->forceFill(['status' => 'submitted'])->save();
        $this->actingAs($this->admin)->postJson("/api/reports/{$this->report->id}/return", ['reason' => 'Semak BM'])->assertJsonPath('data.status', 'draft');

        $this->report->refresh()->forceFill(['status' => 'submitted'])->save();
        $this->postJson("/api/classes/{$this->classA->id}/reports/bulk", ['assessment_id' => $this->trial()->id, 'action' => 'approve'])->assertJsonPath('updated', 1);
        $this->postJson("/api/classes/{$this->classA->id}/reports/bulk", ['assessment_id' => $this->trial()->id, 'action' => 'publish'])->assertJsonPath('updated', 1);
        $this->assertTrue($this->report->fresh()->isPublished());

        $this->actingAs($this->teacherA)->postJson("/api/classes/{$this->classA->id}/reports/bulk", ['assessment_id' => $this->trial()->id, 'action' => 'approve'])->assertForbidden();
    }
}
