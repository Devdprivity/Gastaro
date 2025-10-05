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
    ];

    protected $casts = [
        'owner_amount' => 'decimal:2',
        'shared_amount' => 'decimal:2',
        'shared_percentage' => 'decimal:2',
        'responded_at' => 'datetime',
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
        $this->update([
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
