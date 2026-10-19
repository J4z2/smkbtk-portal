<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\Guardian;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MeetingTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    private function slot(int $capacity = 1): int
    {
        return $this->actingAs($this->teacherA)->postJson("/api/classes/{$this->classA->id}/meeting-slots", [
            'date' => now()->addDays(3)->toDateString(), 'starts_at' => '09:00', 'ends_at' => '09:15', 'capacity' => $capacity,
        ])->assertCreated()->json('id');
    }

    public function test_parent_books_and_slot_fills_up(): void
    {
        $slot = $this->slot(1);
        $this->actingAs($this->parent);
        $snapshot = $this->getJson('/api/portal/snapshot')->json();
        $this->assertCount(1, $snapshot['meetingSlots']);
        $this->assertSame('5A', $snapshot['meetingSlots'][0]['classId']);

        $booking = $this->postJson("/api/meeting-slots/{$slot}/book", ['student_id' => $this->studentA->id, 'topic' => 'Akademik'])->assertCreated()->json('id');
        $this->postJson("/api/meeting-slots/{$slot}/book", ['student_id' => $this->studentA->id, 'topic' => 'Lagi'])->assertStatus(422);
        $this->assertSame('booked', $this->getJson('/api/portal/snapshot')->json('meetings.0.status'));

        // Teacher cannot delete a booked slot; parent cancels, then it can go.
        $this->actingAs($this->teacherA)->deleteJson("/api/meeting-slots/{$slot}")->assertStatus(422);
        $this->actingAs($this->parent)->patchJson("/api/meeting-bookings/{$booking}", ['status' => 'cancelled'])->assertOk();
        $this->actingAs($this->teacherA)->deleteJson("/api/meeting-slots/{$slot}")->assertOk();
    }

    public function test_parents_of_other_classes_and_other_teachers_are_refused(): void
    {
        $slot = $this->slot();
        $otherParent = $this->makeUser(Role::Parent, 'other@test.my');
        Guardian::create(['name' => 'Ibu Bala', 'user_id' => $otherParent->id])->students()->attach($this->studentB->id);

        $this->actingAs($otherParent)->postJson("/api/meeting-slots/{$slot}/book", ['student_id' => $this->studentB->id, 'topic' => 'X'])->assertStatus(422);
        $this->actingAs($otherParent)->postJson("/api/meeting-slots/{$slot}/book", ['student_id' => $this->studentA->id, 'topic' => 'X'])->assertForbidden();
        $this->actingAs($this->teacherB)->postJson("/api/classes/{$this->classA->id}/meeting-slots", ['date' => now()->addDay()->toDateString(), 'starts_at' => '09:00', 'ends_at' => '09:15'])->assertForbidden();
        $this->actingAs($this->teacherA)->postJson("/api/classes/{$this->classA->id}/meeting-slots", ['date' => now()->subDay()->toDateString(), 'starts_at' => '09:00', 'ends_at' => '09:15'])->assertStatus(422);
    }

    public function test_teacher_marks_meeting_done_but_parent_cannot(): void
    {
        $slot = $this->slot();
        $booking = $this->actingAs($this->parent)->postJson("/api/meeting-slots/{$slot}/book", ['student_id' => $this->studentA->id, 'topic' => 'Akademik'])->json('id');
        $this->patchJson("/api/meeting-bookings/{$booking}", ['status' => 'done'])->assertForbidden();
        $this->actingAs($this->teacherA)->patchJson("/api/meeting-bookings/{$booking}", ['status' => 'done'])->assertOk();
    }
}
