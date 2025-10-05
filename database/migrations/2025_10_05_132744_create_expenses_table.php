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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('description');
            $table->string('category')->nullable();
            $table->date('expense_date');
            $table->string('payment_method')->nullable();
            $table->string('image_path')->nullable();
            $table->text('notes')->nullable();
            $table->string('detected_from')->nullable(); // 'voice', 'ocr', 'manual', 'notification'
            $table->json('raw_data')->nullable(); // Store original OCR/voice data
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
