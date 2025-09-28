<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_record_entries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('medical_record_id')->constrained('medical_records')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('employee_info_id')->constrained('employee_info')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('appointment_id')->constrained('appointments')->cascadeOnUpdate()->cascadeOnDelete();

            $table->string('title');
            $table->text('content_html');
            $table->text('content_json')->nullable();

            $table->enum('entry_type', ['allergy', 'diagnosis', 'observation', 'note', 'vitals', 'immunization', 'lab_result', 'treatment', 'procedure', 'other'])->default('note');
            $table->boolean('is_visible_to_patient')->default(true);

            $table->timestamps();

            $table->index(['medical_record_id', 'entry_type']);
            $table->index(['employee_info_id', 'created_at']);

            if (DB::getDriverName() === 'mysql' || DB::getDriverName() === 'pgsql') {
                $table->fullText(['title', 'content_html']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_entries');
    }
};
