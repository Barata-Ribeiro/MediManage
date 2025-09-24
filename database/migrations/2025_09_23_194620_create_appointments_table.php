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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_info_id')->constrained('patient_info')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('employee_info_id')->constrained('employee_info')->cascadeOnUpdate()->cascadeOnDelete();

            $table->dateTime('appointment_date');
            $table->enum('status', ['scheduled', 'confirmed', 'checked_in', 'canceled', 'missed', 'completed'])->default('scheduled');
            $table->string('reason_for_visit')->nullable();

            $table->timestamps();

            $table->index(['patient_info_id', 'appointment_date']);
            $table->index(['employee_info_id', 'appointment_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
