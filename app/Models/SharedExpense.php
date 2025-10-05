<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedExpense extends Model
{
    protected $fillable = [
        'expense_id',
        'owner_id',
        'shared_with_id',
        'owner_amount',
        'shared_amount',
        'shared_percentage',
        'status',
        'responded_at',
        'expense_data',
    ];

    protected $casts = [
        'owner_amount' => 'decimal:2',
        'shared_amount' => 'decimal:2',
        'shared_percentage' => 'decimal:2',
        'responded_at' => 'datetime',
        'expense_data' => 'array',
    ];

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function sharedWith(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_with_id');
    }

    public function accept(): void
    {
        $expenseData = $this->expense_data;

        // Crear el gasto para el CREADOR (owner)
        $ownerExpense = Expense::create([
            'user_id' => $this->owner_id,
            'amount' => $this->owner_amount,
            'description' => $expenseData['description'],
            'category' => $expenseData['category'] ?? null,
            'expense_date' => $expenseData['expense_date'],
            'payment_method' => null,
            'notes' => $expenseData['notes'] ?? null,
            'image' => $expenseData['image'] ?? null,
        ]);

        // Crear el gasto para el usuario que ACEPTA
        Expense::create([
            'user_id' => $this->shared_with_id,
            'amount' => $this->shared_amount,
            'description' => $expenseData['description'] . ' (compartido con ' . $this->owner->name . ')',
            'category' => $expenseData['category'] ?? null,
            'expense_date' => $expenseData['expense_date'],
            'payment_method' => null,
            'notes' => 'Gasto compartido - ' . ($expenseData['notes'] ?? ''),
            'image' => $expenseData['image'] ?? null,
        ]);

        $this->update([
            'expense_id' => $ownerExpense->id,
            'status' => 'accepted',
            'responded_at' => now(),
        ]);
    }

    public function reject(): void
    {
        $this->update([
            'status' => 'rejected',
            'responded_at' => now(),
        ]);
    }
}
