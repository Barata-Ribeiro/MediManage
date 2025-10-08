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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();

            $table->string('title');
            $table->string('subtitle');
            $table->string('slug')->unique();
            $table->string('excerpt', 500);

            $table->text('content_html');
            $table->text('content_json')->nullable();
            $table->string('thumbnail')->nullable();
            $table->boolean('is_published')->default(false);

            $table->timestamps();

            $table->index(['user_id', 'is_published']);
            $table->index(['title', 'slug']);

            if (DB::getDriverName() === 'mysql' || DB::getDriverName() === 'pgsql') {
                $table->fullText(['title', 'subtitle', 'excerpt', 'content_html']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
