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
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('salary', 10, 2)->default(0);
            $table->decimal('payments', 10, 2)->default(0);
            $table->decimal('transfers', 10, 2)->default(0);
            $table->decimal('cash', 10, 2)->default(0);
            $table->year('year');
            $table->tinyInteger('month'); // 1-12
            $table->text('notes')->nullable();
            $table->timestamps();

            // Unique constraint: one income record per user per month
            $table->unique(['user_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
