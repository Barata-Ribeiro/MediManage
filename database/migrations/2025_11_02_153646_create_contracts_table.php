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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_info_id')->constrained('employee_info')->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('rate_type', ['daily', 'monthly']);
            $table->decimal('rate', 10, 2);
            $table->enum('contract_type', ['full_time', 'part_time', 'contractor', 'intern']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
