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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('year')->unique();
            $table->date('starts_on');
            $table->date('ends_on');
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name_ms', 100);
            $table->string('name_en', 100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Default subject list for each form, maintained by admin.
        Schema::create('form_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('form');
            $table->boolean('is_core')->default(true);
            $table->timestamps();
            $table->unique(['subject_id', 'form']);
        });

        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('form');
            $table->enum('form6_stage', ['bawah', 'atas'])->nullable();
            $table->string('name', 60);
            $table->string('code', 32);
            $table->boolean('is_dlp')->default(false);
            $table->enum('session', ['pagi', 'petang'])->default('pagi');
            $table->foreignId('class_teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['academic_year_id', 'code']);
            $table->unique(['academic_year_id', 'class_teacher_id']);
            $table->index(['academic_year_id', 'form']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
        Schema::dropIfExists('form_subjects');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('academic_years');
    }
};
