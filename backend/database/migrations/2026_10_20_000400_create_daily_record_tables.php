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
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('status', ['P', 'A', 'L', 'MC', 'U']);
            $table->string('note')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['student_id', 'date']);
            $table->index('date');
        });

        Schema::create('absence_notices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date_from');
            $table->date('date_to');
            $table->enum('reason', ['keluarga', 'kesihatan', 'mc', 'lain']);
            $table->text('note')->nullable();
            $table->string('document_path')->nullable();
            $table->enum('status', ['submitted', 'acknowledged', 'rejected'])->default('submitted');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->index(['student_id', 'status']);
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title_ms', 200);
            $table->string('title_en', 200)->nullable();
            $table->text('body_ms');
            $table->text('body_en')->nullable();
            $table->string('category', 40)->default('makluman');
            $table->enum('audience', ['all', 'form', 'class'])->default('all');
            $table->string('audience_value', 32)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index('published_at');
        });

        Schema::create('meeting_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date');
            $table->time('starts_at');
            $table->time('ends_at');
            $table->unsignedSmallInteger('capacity')->default(1);
            $table->timestamps();
        });

        Schema::create('meeting_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_slot_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('booked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('topic', 100);
            $table->enum('status', ['booked', 'cancelled', 'done'])->default('booked');
            $table->timestamps();
        });

        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('type', ['kelab', 'sukan', 'badan_beruniform', 'lain'])->default('lain');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('student_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained()->restrictOnDelete();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->string('role_or_detail', 200)->nullable();
            $table->unsignedTinyInteger('score')->nullable();
            $table->string('achievement', 60)->nullable();
            $table->timestamps();
        });

        Schema::create('interventions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 60);
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('follow_up_on')->nullable();
            $table->text('note');
            $table->enum('status', ['active', 'resolved'])->default('active');
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['student_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
        Schema::dropIfExists('student_activities');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('meeting_bookings');
        Schema::dropIfExists('meeting_slots');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('absence_notices');
        Schema::dropIfExists('attendance_records');
    }
};
