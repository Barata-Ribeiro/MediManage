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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('patient_info_id')->nullable()->constrained('patient_info')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('employee_info_id')->nullable()->constrained('employee_info')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['patient_info_id']);
            $table->dropColumn('patient_info_id');
            $table->dropForeign(['employee_info_id']);
            $table->dropColumn('employee_info_id');
        });
    }
};
