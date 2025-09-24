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
        Schema::create('employee_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('gender');
            $table->date('date_of_birth');
            $table->string('phone_number');
            $table->string('address');

            // Medical Professional Details
            $table->string('registration_number');
            $table->string('registration_origin');
            $table->string('specialization');
            $table->string('license_number');
            $table->date('license_expiry_date');

            // Other Staff Details
            $table->string('position');
            $table->boolean('is_active')->default(true);
            $table->date('hire_date');
            $table->date('termination_date')->nullable();

            $table->timestamps();

            $table->index(['last_name', 'first_name']);
            $table->index(['specialization']);
            $table->index(['is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_info');
    }
};
