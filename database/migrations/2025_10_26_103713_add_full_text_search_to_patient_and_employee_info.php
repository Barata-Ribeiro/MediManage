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
        Schema::table('patient_info', function (Blueprint $table) {
            $table->fullText(
                ['first_name', 'last_name', 'phone_number', 'address', 'insurance_company', 'emergency_contact_name'],
                'patient_info_fulltext_index'
            );
        });

        Schema::table('employee_info', function (Blueprint $table) {
            $table->fullText(
                ['first_name', 'last_name', 'phone_number', 'address', 'specialization', 'position'],
                'employee_info_fulltext_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_info', function (Blueprint $table) {
            $table->dropFullText('patient_info_fulltext_index');
        });

        Schema::table('employee_info', function (Blueprint $table) {
            $table->dropFullText('employee_info_fulltext_index');
        });
    }
};
