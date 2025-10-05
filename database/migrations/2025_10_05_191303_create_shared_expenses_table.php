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
        Schema::create('shared_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->constrained()->onDelete('cascade');
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade'); // Quien creó el gasto
            $table->foreignId('shared_with_id')->constrained('users')->onDelete('cascade'); // Con quién se comparte
            $table->decimal('owner_amount', 10, 2); // Monto que paga el dueño
            $table->decimal('shared_amount', 10, 2); // Monto que paga la persona compartida
            $table->decimal('shared_percentage', 5, 2)->nullable(); // Porcentaje (ej: 50.00 para 50%)
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_expenses');
    }
};
