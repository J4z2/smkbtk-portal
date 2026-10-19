<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\Enrolment;
use App\Models\Guardian;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;

/**
 * A small school for API tests: two Form 5 classes, each with a class
 * teacher and one student, a parent for the first student, and an admin.
 */
trait BuildsSchool
{
    protected AcademicYear $year;

    protected SchoolClass $classA;

    protected SchoolClass $classB;

    protected User $teacherA;

    protected User $teacherB;

    protected User $admin;

    protected User $superAdmin;

    protected User $parent;

    protected Student $studentA;

    protected Student $studentB;

    protected Guardian $guardian;

    protected function buildSchool(): void
    {
        $this->seed(ReferenceDataSeeder::class);
        $this->year = AcademicYear::current();
        $this->teacherA = $this->makeUser(Role::ClassTeacher, 'a@test.my');
        $this->teacherB = $this->makeUser(Role::ClassTeacher, 'b@test.my');
        $this->admin = $this->makeUser(Role::Admin, 'admin@test.my');
        $this->superAdmin = $this->makeUser(Role::SuperAdmin, 'super@test.my');
        $this->parent = $this->makeUser(Role::Parent, 'parent@test.my');

        $this->classA = SchoolClass::create(['academic_year_id' => $this->year->id, 'form' => 5, 'name' => '5 A', 'code' => '5A', 'class_teacher_id' => $this->teacherA->id]);
        $this->classB = SchoolClass::create(['academic_year_id' => $this->year->id, 'form' => 5, 'name' => '5 B', 'code' => '5B', 'class_teacher_id' => $this->teacherB->id]);
        $this->studentA = $this->makeStudent('S-A', 'Ali', $this->classA);
        $this->studentB = $this->makeStudent('S-B', 'Bala', $this->classB);

        $this->guardian = Guardian::create(['name' => 'Ibu Ali', 'user_id' => $this->parent->id]);
        $this->guardian->students()->attach($this->studentA->id, ['relationship' => 'ibu', 'is_primary' => true]);
    }

    protected function makeUser(Role $role, string $email, string $password = 'secret123'): User
    {
        return User::create(['name' => ucfirst($role->value).' '.$email, 'role' => $role, 'email' => $email, 'password' => $password, 'must_change_password' => false]);
    }

    protected function makeStudent(string $no, string $name, SchoolClass $class): Student
    {
        $student = Student::create(['student_no' => $no, 'name' => $name, 'gender' => 'L', 'race' => 'melayu', 'religion' => 'islam']);
        Enrolment::create(['student_id' => $student->id, 'class_id' => $class->id, 'academic_year_id' => $class->academic_year_id, 'starts_on' => '2026-01-12', 'is_current' => true]);

        return $student;
    }

    protected function trial(int $form = 5): Assessment
    {
        return Assessment::where('academic_year_id', $this->year->id)->where('form', $form)->where('key', 'trial')->firstOrFail();
    }
}
