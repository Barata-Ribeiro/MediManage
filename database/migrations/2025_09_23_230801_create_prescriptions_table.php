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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_info_id')->constrained('patient_info')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('employee_info_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();

            $table->text('prescription_details');
            $table->date('date_issued');
            $table->date('date_expires')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
