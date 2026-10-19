<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    public function test_teacher_records_a_day_and_parent_sees_month(): void
    {
        $this->actingAs($this->teacherA);
        foreach (['2026-06-01' => 'P', '2026-06-02' => 'L', '2026-06-03' => 'MC', '2026-06-04' => 'U'] as $date => $status) {
            $this->putJson("/api/classes/{$this->classA->id}/attendance", ['date' => $date, 'records' => [['student_id' => $this->studentA->id, 'status' => $status]]])->assertOk();
        }
        $this->getJson("/api/classes/{$this->classA->id}/attendance?date=2026-06-03")->assertJsonPath('students.0.status', 'MC');

        $this->actingAs($this->parent)->getJson("/api/students/{$this->studentA->id}/attendance?month=2026-06")
            ->assertOk()->assertJsonPath('total', 4)->assertJsonPath('present', 2)->assertJsonPath('rate', 50)
            ->assertJsonPath('months.0', '2026-06');
    }

    public function test_saving_again_updates_instead_of_duplicating(): void
    {
        $this->actingAs($this->teacherA);
        $payload = fn ($s) => ['date' => '2026-06-01', 'records' => [['student_id' => $this->studentA->id, 'status' => $s]]];
        $this->putJson("/api/classes/{$this->classA->id}/attendance", $payload('A'));
        $this->putJson("/api/classes/{$this->classA->id}/attendance", $payload('P'));
        $this->assertSame(1, $this->studentA->attendance()->count());
    }

    public function test_future_dates_and_other_class_students_are_refused(): void
    {
        $this->actingAs($this->teacherA);
        $this->putJson("/api/classes/{$this->classA->id}/attendance", ['date' => now()->addDay()->toDateString(), 'records' => [['student_id' => $this->studentA->id, 'status' => 'P']]])->assertStatus(422);
        $this->putJson("/api/classes/{$this->classA->id}/attendance", ['date' => '2026-06-01', 'records' => [['student_id' => $this->studentB->id, 'status' => 'P']]])->assertStatus(422);
    }
}
