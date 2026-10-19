<?php

namespace Tests\Feature;

use App\Models\Guardian;
use App\Models\Report;
use App\Models\User;
use App\Services\ReportBook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RetentionTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    public function test_leavers_past_retention_are_anonymised_but_marks_stay(): void
    {
        $report = app(ReportBook::class)->forStudent($this->studentA, $this->classA, $this->trial());
        $report->marks()->first()->update(['mark' => 80]);
        $report->update(['teacher_comment' => 'Ali seorang murid yang rajin.']);
        $this->studentA->setIc('100101-01-0001')->forceFill(['status' => 'graduated', 'left_on' => now()->subYears(6)])->save();
        $this->guardian->setIc('800101-01-1111')->save();

        $this->artisan('portal:anonymise-leavers --dry-run')->expectsOutputToContain('1 student record(s) would be anonymised')->assertSuccessful();
        $this->assertSame('Ali', $this->studentA->fresh()->name);

        $this->artisan('portal:anonymise-leavers')->assertSuccessful();
        $student = $this->studentA->fresh();
        $this->assertSame('ANON-'.$student->id, $student->student_no);
        $this->assertNull($student->ic_hash);
        $this->assertNull(Report::find($report->id)->teacher_comment);
        $this->assertSame(80, $report->marks()->first()->mark);

        // The guardian had no other child, so their login is closed too.
        $this->assertNull($this->guardian->fresh()->ic_hash);
        $this->assertSoftDeleted('users', ['id' => $this->parent->id]);
        $this->assertNull(User::withTrashed()->find($this->parent->id)->email);
    }

    public function test_recent_leavers_and_guardians_with_other_children_are_kept(): void
    {
        $this->guardian->students()->attach($this->studentB->id);
        $this->studentA->forceFill(['status' => 'graduated', 'left_on' => now()->subYears(6)])->save();
        $this->studentB->forceFill(['status' => 'transferred_out', 'left_on' => now()->subYears(2)])->save();

        $this->artisan('portal:anonymise-leavers')->assertSuccessful();

        $this->assertStringStartsWith('ANON-', $this->studentA->fresh()->student_no);
        $this->assertSame('Bala', $this->studentB->fresh()->name);
        $this->assertSame('Ibu Ali', Guardian::find($this->guardian->id)->name);
        $this->assertNotSoftDeleted('users', ['id' => $this->parent->id]);
    }
}
