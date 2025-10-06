<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    /**
     * Mostrar el dashboard
     */
    public function index(Request $request): Response
    {
        $expenses = auth()->user()->expenses()
            ->orderBy('expense_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate total income
        $totalIncome = auth()->user()
            ->incomes()
            ->get()
            ->sum(function ($income) {
                return $income->total;
            });

        // Calculate total expenses
        $totalExpenses = auth()->user()->expenses()->sum('amount');

        // Calculate balance (Income - Expenses)
        $balance = $totalIncome - $totalExpenses;

        $stats = [
            'total' => $balance, // Balance real (Ingresos - Gastos)
            'income' => $totalIncome, // Total de ingresos
            'expenses' => $totalExpenses, // Total de gastos
            'available' => $balance, // Dinero disponible (mismo que balance)
            'count' => auth()->user()->expenses()->count(),
            'today' => auth()->user()->expenses()->whereDate('expense_date', today())->sum('amount'),
            'month' => auth()->user()->expenses()->whereMonth('expense_date', now()->month)->sum('amount'),
        ];

        // Get expenses grouped by category for chart (top 5)
        $categoryStats = auth()->user()
            ->expenses()
            ->selectRaw('category, SUM(amount) as total, COUNT(*) as count')
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'total' => (float) $item->total,
                    'count' => $item->count,
                ];
            });

        // Get shared expenses with details (last 5)
        $userId = auth()->id();
        $sharedExpenses = \App\Models\SharedExpense::where(function($query) use ($userId) {
                $query->where('owner_id', $userId)
                    ->orWhere('shared_with_id', $userId);
            })
            ->with(['owner', 'sharedWith', 'expense'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($shared) use ($userId) {
                $isOwner = $shared->owner_id === $userId;
                $otherUser = $isOwner ? $shared->sharedWith : $shared->owner;

                return [
                    'id' => $shared->id,
                    'description' => $shared->expense_data['description'] ?? ($shared->expense ? $shared->expense->description : 'Gasto compartido'),
                    'amount' => $isOwner ? $shared->owner_amount : $shared->shared_amount,
                    'total_amount' => $shared->expense_data['amount'] ?? ($shared->expense ? $shared->expense->amount : 0),
                    'status' => $shared->status,
                    'other_user' => [
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                    ],
                    'is_owner' => $isOwner,
                    'created_at' => $shared->created_at->toDateString(),
                ];
            });

        return Inertia::render('dashboard', [
            'expenses' => $expenses,
            'stats' => $stats,
            'categoryStats' => $categoryStats,
            'sharedExpenses' => $sharedExpenses,
        ]);
    }
}
