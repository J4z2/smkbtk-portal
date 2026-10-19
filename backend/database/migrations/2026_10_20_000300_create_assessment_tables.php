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
        Schema::create('coex_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('gear')->unique();
            $table->unsignedTinyInteger('min_mark');
            $table->unsignedTinyInteger('max_mark');
            $table->string('grade', 4);
            $table->string('zone', 60);
            $table->string('level', 60);
            $table->text('action_ms');
            $table->text('action_en')->nullable();
            $table->string('color', 7);
            $table->timestamps();
        });

        // Checkpoints per form per year: tov, pat, ppt, trial, final.
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('form');
            $table->string('key', 20);
            $table->string('name_ms', 100);
            $table->string('name_en', 100);
            $table->date('exam_date')->nullable();
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->boolean('is_current')->default(false);
            $table->boolean('is_open')->default(false);
            $table->timestamps();
            $table->unique(['academic_year_id', 'form', 'key']);
        });

        // One report per student per assessment; holds the approval status.
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->restrictOnDelete();
            $table->foreignId('assessment_id')->constrained()->restrictOnDelete();
            $table->foreignId('class_id')->constrained('classes')->restrictOnDelete();
            $table->enum('status', ['draft', 'submitted', 'approved', 'published'])->default('draft');
            $table->text('teacher_comment')->nullable();
            $table->text('support_note')->nullable();
            $table->text('discipline_note')->nullable();
            $table->unsignedTinyInteger('co_score')->nullable();
            $table->unsignedTinyInteger('attendance_rate')->nullable();
            foreach (['submitted', 'approved', 'published', 'parent_acknowledged'] as $step) {
                $table->foreignId("{$step}_by")->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp("{$step}_at")->nullable();
            }
            $table->timestamps();
            $table->unique(['student_id', 'assessment_id']);
            $table->index(['class_id', 'status']);
        });

        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('mark')->nullable();
            $table->boolean('is_absent')->default(false);
            // Snapshot taken when the report is published.
            $table->string('grade', 4)->nullable();
            $table->unsignedTinyInteger('gear')->nullable();
            $table->foreignId('entered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['report_id', 'subject_id']);
        });

        Schema::create('targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->foreignId('subject_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('target_mark');
            $table->foreignId('set_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['student_id', 'academic_year_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('targets');
        Schema::dropIfExists('marks');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('coex_rules');
    }
};
