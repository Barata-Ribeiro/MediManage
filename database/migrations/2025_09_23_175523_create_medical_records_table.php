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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_info_id')->constrained('patient_info')->cascadeOnUpdate()->cascadeOnDelete();

            $table->text('medical_notes')->nullable();

            $table->timestamps();

            $table->fullText('medical_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
