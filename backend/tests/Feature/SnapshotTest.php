<?php

namespace Tests\Feature;

use App\Models\Guardian;
use App\Models\Report;
use App\Models\Subject;
use App\Services\ReportBook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SnapshotTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    private Report $report;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
        $this->report = app(ReportBook::class)->forStudent($this->studentA, $this->classA, $this->trial());
        $this->report->marks()->where('subject_id', Subject::where('code', 'BM')->value('id'))->update(['mark' => 77]);
    }

    public function test_parent_snapshot_hides_unpublished_marks(): void
    {
        $this->actingAs($this->parent);
        $data = $this->getJson('/api/portal/snapshot')->assertOk()->json();
        $this->assertCount(1, $data['students']);
        $this->assertSame('S-A', $data['students'][0]['id']);
        $this->assertNotContains(77, $data['students'][0]['scores']);
        $this->assertSame([], $data['students'][0]['coex']['checkpoints']['trial']['marks']);
        $this->assertSame(['S-A'], $data['accounts']['parents'][0]['childIds']);
        $this->assertSame([], $data['audit']);

        $this->report->forceFill(['status' => 'published'])->save();
        $data = $this->getJson('/api/portal/snapshot')->json();
        $this->assertSame(77, $data['students'][0]['scores']['Bahasa Melayu']);
        $this->assertSame('published', $data['students'][0]['report']['status']);
    }

    public function test_teacher_and_admin_snapshots(): void
    {
        $data = $this->actingAs($this->teacherA)->getJson('/api/portal/snapshot')->json();
        $this->assertSame(['S-A'], array_column($data['students'], 'id'));
        $this->assertSame(77, $data['students'][0]['scores']['Bahasa Melayu']);
        $this->assertSame(['5A'], $data['accounts']['teachers'][0]['classes']);

        $data = $this->actingAs($this->admin)->getJson('/api/portal/snapshot')->json();
        $this->assertCount(2, $data['students']);
        $this->assertCount(2, $data['school']['classes']);
        $this->assertIsArray($data['audit']);
    }

    public function test_public_school_info_needs_no_login(): void
    {
        $this->getJson('/api/public/school')->assertOk()->assertJsonPath('name', 'SMK Bandar Tasik Kesuma');
    }

    public function test_admin_manages_classes_and_subjects(): void
    {
        $this->actingAs($this->admin);
        $id = $this->postJson('/api/admin/classes', ['code' => '1C', 'name' => '1 Cempaka', 'form' => 1])->assertCreated()->json('id');
        $this->postJson('/api/admin/classes', ['code' => '1C', 'name' => 'Dup', 'form' => 1])->assertStatus(422);
        // A teacher can lead only one class per year.
        $this->patchJson("/api/admin/classes/{$id}", ['class_teacher_id' => $this->teacherA->id])->assertStatus(422);
        $this->deleteJson("/api/admin/classes/{$id}")->assertOk();
        $this->deleteJson("/api/admin/classes/{$this->classA->id}")->assertStatus(422);

        $this->postJson('/api/admin/subjects', ['name_ms' => 'Sains Komputer', 'band' => 'upper'])->assertCreated();
        $profiles = $this->getJson('/api/portal/snapshot')->json('school.subjectProfiles');
        $this->assertContains('Sains Komputer', $profiles['upper']);
        $this->assertNotContains('Sains Komputer', $profiles['lower']);

        $subject = Subject::where('name_ms', 'Sains Komputer')->first();
        $this->postJson("/api/admin/subjects/{$subject->id}/remove", ['band' => 'upper'])->assertOk();
        $this->assertNotContains('Sains Komputer', $this->getJson('/api/portal/snapshot')->json('school.subjectProfiles.upper'));

        $this->actingAs($this->teacherA)->postJson('/api/admin/classes', ['code' => '1D', 'name' => 'X', 'form' => 1])->assertForbidden();
    }

    public function test_student_form_links_guardian_and_targets_save(): void
    {
        $this->actingAs($this->admin);
        $a = $this->postJson('/api/students', ['name' => 'Adik', 'gender' => 'P', 'class_id' => $this->classA->id, 'guardian_name' => 'Ibu Adik', 'guardian_phone' => '011-2223333', 'guardian_ic' => '820303-03-3333'])
            ->assertCreated()->json('data');
        $this->assertStringStartsWith('BTK2026-', $a['student_no']);
        $this->postJson('/api/students', ['name' => 'Abang', 'gender' => 'L', 'class_id' => $this->classB->id, 'guardian_name' => 'Ibu Adik', 'guardian_ic' => '820303033333'])->assertCreated();
        $this->assertSame(2, Guardian::where('name', 'Ibu Adik')->sole()->students()->count());

        $bm = Subject::where('code', 'BM')->value('id');
        $this->actingAs($this->teacherA)->putJson("/api/students/{$this->studentA->id}/targets", ['targets' => [['subject_id' => $bm, 'target_mark' => 90]]])->assertOk();
        $this->actingAs($this->teacherB)->putJson("/api/students/{$this->studentA->id}/targets", ['targets' => [['subject_id' => $bm, 'target_mark' => 10]]])->assertForbidden();
        $students = collect($this->actingAs($this->teacherA)->getJson('/api/portal/snapshot')->json('students'))->keyBy('id');
        $this->assertSame(90, $students['S-A']['coex']['checkpoints']['target']['marks']['Bahasa Melayu']);
    }
}
