<?php

namespace Tests\Feature;

use App\Models\Guardian;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ImportAndAccountsTest extends TestCase
{
    use BuildsSchool, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildSchool();
    }

    private function upload(string $csv)
    {
        return $this->actingAs($this->admin)->post('/api/admin/imports/students', [
            'file' => UploadedFile::fake()->createWithContent('murid.csv', $csv),
        ], ['Accept' => 'application/json']);
    }

    public function test_import_links_siblings_by_guardian_ic_and_reports_bad_rows(): void
    {
        $csv = "\u{FEFF}Nama,No Pelajar,Kelas,Jantina,Kaum,Agama,Penjaga,IC Penjaga,Telefon Penjaga,Hubungan\n"
            ."\"Siti, Binti Ahmad\",T-1,5A,P,Melayu,Islam,Ahmad bin Ali,700101-01-5555,012-1112222,bapa\n"
            ."Hakim bin Ahmad,T-2,5b,Lelaki,Melayu,Islam,Ahmad bin Ali,700101015555,012-1112222,bapa\n"
            ."Tiada Kelas,T-3,9Z,L,,,,,,\n"
            .",T-4,5A,L,,,,,,\n";
        $this->upload($csv)->assertOk()->assertJsonPath('rows_imported', 2)->assertJsonPath('rows_skipped', 2)
            ->assertJsonPath('errors.0.row', 4);

        $this->assertSame('Siti, Binti Ahmad', Student::where('student_no', 'T-1')->value('name'));
        $guardian = Guardian::where('name', 'Ahmad bin Ali')->sole();
        $this->assertSame(2, $guardian->students()->count());
        $this->assertSame('60121112222', $guardian->phone);

        // Re-importing updates instead of duplicating.
        $this->upload($csv)->assertOk();
        $this->assertSame(4, Student::count());
    }

    public function test_missing_required_columns_fail_the_batch(): void
    {
        $this->upload("Nama,Kelas\nAli,5A\n")->assertStatus(422)->assertJsonPath('status', 'failed');
    }

    public function test_class_parent_accounts_create_slips_that_can_log_in(): void
    {
        $g = Guardian::create(['name' => 'Bapa Bala', 'phone' => '60199998888']);
        $g->setIc('750202-02-7777')->save();
        $g->students()->attach($this->studentB->id, ['relationship' => 'bapa']);

        $slips = $this->actingAs($this->teacherB)->postJson("/api/classes/{$this->classB->id}/parent-accounts")
            ->assertOk()->assertJsonPath('created', 1)->json('slips');
        $this->assertSame('750202-02-7777', $slips[0]['username']);

        // Teacher A may not create accounts for class B.
        $this->actingAs($this->teacherA)->postJson("/api/classes/{$this->classB->id}/parent-accounts")->assertForbidden();

        auth()->logout();
        $this->postJson('/api/login', ['login' => '750202-02-7777', 'password' => $slips[0]['one_time_password']])
            ->assertOk()->assertJsonPath('must_change_password', true);

        // Running again does not create a second login.
        $this->actingAs($this->admin)->postJson("/api/classes/{$this->classB->id}/parent-accounts")->assertJsonPath('created', 0);
        $this->assertSame(1, User::where('role', 'parent')->where('name', 'Bapa Bala')->count());
    }

    public function test_only_super_admin_creates_admins(): void
    {
        $this->actingAs($this->admin)->postJson('/api/admin/users', ['name' => 'X', 'role' => 'admin', 'email' => 'x@test.my'])->assertForbidden();
        $this->postJson('/api/admin/users', ['name' => 'Guru Baru', 'role' => 'class_teacher', 'email' => 'g@test.my'])->assertCreated()->assertJsonStructure(['one_time_password']);
        $this->actingAs($this->superAdmin)->postJson('/api/admin/users', ['name' => 'X', 'role' => 'admin', 'email' => 'x@test.my'])->assertCreated();
    }
}
