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
    public function index(Request $request): Response|RedirectResponse
    {
        // Detectar si es un dispositivo de escritorio
        $userAgent = $request->header('User-Agent');
        $isMobile = preg_match('/(android|iphone|ipad|mobile)/i', $userAgent);

        // Si es desktop, redirigir a welcome
        if (!$isMobile) {
            return redirect()->route('welcome');
        }

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
            'count' => auth()->user()->expenses()->count(),
            'today' => auth()->user()->expenses()->whereDate('expense_date', today())->sum('amount'),
            'month' => auth()->user()->expenses()->whereMonth('expense_date', now()->month)->sum('amount'),
        ];

        return Inertia::render('dashboard', [
            'expenses' => $expenses,
            'stats' => $stats,
        ]);
    }
}
