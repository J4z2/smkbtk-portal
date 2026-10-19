<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // A parent or guardian. Exists before (or without) a login account.
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('name', 150);
            $table->char('ic_hash', 64)->nullable()->unique();
            $table->text('ic_encrypted')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 190)->nullable();
            $table->text('address')->nullable();
            $table->string('occupation', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_no', 32)->unique();
            $table->string('name', 150);
            $table->char('ic_hash', 64)->nullable()->unique();
            $table->text('ic_encrypted')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['L', 'P']);
            $table->enum('race', ['melayu', 'cina', 'india', 'lain'])->nullable();
            $table->enum('religion', ['islam', 'bukan_islam'])->nullable();
            $table->boolean('is_citizen')->default(true);
            $table->string('photo_path')->nullable();
            $table->enum('status', ['active', 'transferred_out', 'graduated', 'archived'])->default('active');
            $table->date('enrolled_on')->nullable();
            $table->date('left_on')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('status');
        });

        Schema::create('guardian_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guardian_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->enum('relationship', ['bapa', 'ibu', 'penjaga'])->default('penjaga');
            $table->boolean('is_primary')->default(false);
            $table->boolean('can_view')->default(true);
            $table->timestamps();
            $table->unique(['guardian_id', 'student_id']);
        });

        // Which class a student is in. A mid-year move closes one row and opens another.
        Schema::create('enrolments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->restrictOnDelete();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->date('starts_on');
            $table->date('ends_on')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestamps();
            $table->index(['class_id', 'is_current']);
            $table->index(['student_id', 'academic_year_id']);
        });

        Schema::create('student_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->foreignId('subject_id')->constrained()->restrictOnDelete();
            $table->timestamps();
            $table->unique(['student_id', 'academic_year_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_subjects');
        Schema::dropIfExists('enrolments');
        Schema::dropIfExists('guardian_student');
        Schema::dropIfExists('students');
        Schema::dropIfExists('guardians');
    }
};
