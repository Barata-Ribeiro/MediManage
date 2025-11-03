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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_info_id')->constrained('patient_info')->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('consultation_date');
            $table->string('notes')->nullable();
            $table->date('due_date');
            $table->decimal('amount', 10, 2);
            $table->string('payment_method');
            $table->enum('status', ['paid', 'unpaid', 'overdue'])->default('unpaid');
            $table->timestamps();

            $table->index(['patient_info_id', 'consultation_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
