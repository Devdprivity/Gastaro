<?php

namespace App\Http\Controllers;

use App\Models\SharedExpense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserSearchViewController extends Controller
{
    /**
     * Mostrar la vista de búsqueda de usuarios
     */
    public function index()
    {
        $user = auth()->user();

        // Obtener los gastos compartidos del usuario
        $sharedExpenses = SharedExpense::with(['expense', 'owner', 'sharedWith'])
            ->where(function ($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhere('shared_with_id', $user->id);
            })
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($sharedExpense) use ($user) {
                // Determinar el otro usuario en el gasto compartido
                $otherUser = $sharedExpense->owner_id === $user->id
                    ? $sharedExpense->sharedWith
                    : $sharedExpense->owner;

                return [
                    'id' => $sharedExpense->id,
                    'user' => [
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                    ],
                    'expense' => [
                        'description' => $sharedExpense->expense->description,
                        'amount' => (float) $sharedExpense->shared_amount,
                        'fullDescription' => $sharedExpense->expense->notes ?? $sharedExpense->expense->description,
                    ],
                    'date' => $sharedExpense->created_at->format('Y-m-d'),
                    'status' => $sharedExpense->status,
                ];
            });

        return Inertia::render('users/search', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'user_code' => $user->user_code,
                    'avatar' => $user->avatar,
                    'currency' => $user->currency,
                    'locale' => $user->locale,
                ]
            ],
            'sharedExpenses' => $sharedExpenses
        ]);
    }
}