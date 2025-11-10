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
        Schema::create('patient_info', function (Blueprint $table) {
            $table->id();

            // Nullable to allow for guest patients
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('gender');
            $table->date('date_of_birth');
            $table->string('phone_number', 30);
            $table->string('address', 500);

            $table->string('insurance_company');
            $table->string('insurance_member_id_number')->unique();
            $table->string('insurance_group_number')->unique();
            $table->string('insurance_policy_number')->unique();

            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->string('emergency_contact_phone_number')->nullable();

            $table->string('allergies')->nullable();
            $table->string('current_medications')->nullable();
            $table->string('past_illnesses')->nullable();
            $table->string('surgeries')->nullable();
            $table->string('family_medical_history')->nullable();

            $table->timestamps();

            $table->index(['last_name', 'first_name']);
            $table->index(['date_of_birth']);
            $table->index(['insurance_company', 'insurance_member_id_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_info');
    }
};
