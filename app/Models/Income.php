<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Income extends Model
{
    protected $fillable = [
        'user_id',
        'salary',
        'payments',
        'transfers',
        'cash',
        'year',
        'month',
        'notes',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'payments' => 'decimal:2',
        'transfers' => 'decimal:2',
        'cash' => 'decimal:2',
        'year' => 'integer',
        'month' => 'integer',
    ];

    protected $appends = [
        'total',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalAttribute(): float
    {
        return (float) $this->salary + (float) $this->payments + (float) $this->transfers + (float) $this->cash;
    }
}
