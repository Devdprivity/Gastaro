<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\SharedExpense;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = $request->user()
            ->expenses()
            ->orderBy('expense_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Calculate stats (assuming all are expenses for now)
        $totalExpenses = $request->user()->expenses()->sum('amount');
        $totalIncome = 0; // For future implementation

        // Get expenses grouped by date for chart (last 7 days)
        $chartData = $request->user()
            ->expenses()
            ->whereDate('expense_date', '>=', now()->subDays(6))
            ->selectRaw('DATE(expense_date) as date, SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total' => (float) $item->total,
                ];
            });

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'stats' => [
                'income' => $totalIncome,
                'expenses' => $totalExpenses,
            ],
            'chartData' => $chartData,
        ]);
    }

    public function create()
    {
        return Inertia::render('expenses/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'detected_from' => 'nullable|in:voice,ocr,manual,notification',
            'raw_data' => 'nullable|array',
            'image' => 'nullable|image|max:5120', // 5MB max
            // Campos para gasto compartido
            'is_shared' => 'nullable|boolean',
            'shared_user_code' => 'nullable|required_if:is_shared,true|string|size:8',
            'shared_type' => 'nullable|required_if:is_shared,true|in:50/50,custom',
            'owner_amount' => 'nullable|required_if:shared_type,custom|numeric|min:0',
            'shared_amount' => 'nullable|required_if:shared_type,custom|numeric|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('expenses', 'public');
            $validated['image_path'] = $path;
        }

        $validated['user_id'] = $request->user()->id;

        $expense = Expense::create($validated);

        // Crear notificación
        NotificationService::createExpenseNotification($request->user(), $expense);

        // Manejar gasto compartido
        if ($request->is_shared && $request->shared_user_code) {
            $sharedUser = User::where('user_code', strtoupper($request->shared_user_code))->first();

            if ($sharedUser) {
                // Calcular montos
                $ownerAmount = $request->owner_amount;
                $sharedAmount = $request->shared_amount;
                $percentage = null;

                if ($request->shared_type === '50/50') {
                    $ownerAmount = $expense->amount / 2;
                    $sharedAmount = $expense->amount / 2;
                    $percentage = 50.00;
                }

                // Crear el gasto compartido
                $sharedExpense = SharedExpense::create([
                    'expense_id' => $expense->id,
                    'owner_id' => $request->user()->id,
                    'shared_with_id' => $sharedUser->id,
                    'owner_amount' => $ownerAmount,
                    'shared_amount' => $sharedAmount,
                    'shared_percentage' => $percentage,
                    'status' => 'pending',
                ]);

                // Crear notificación para el usuario compartido
                NotificationService::createSharedExpenseNotification(
                    $sharedUser,
                    [
                        'id' => $sharedExpense->id,
                        'amount' => $sharedAmount,
                        'description' => $expense->description,
                        'total_amount' => $expense->amount,
                    ],
                    $request->user()
                );
            }
        }

        return redirect()->route('expenses.index')
            ->with('success', 'Gasto registrado exitosamente');
    }

    public function show(Expense $expense)
    {
        $this->authorize('view', $expense);

        return Inertia::render('expenses/show', [
            'expense' => $expense,
        ]);
    }

    public function edit(Expense $expense)
    {
        $this->authorize('update', $expense);

        return Inertia::render('expenses/edit', [
            'expense' => $expense,
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($expense->image_path) {
                Storage::disk('public')->delete($expense->image_path);
            }

            $path = $request->file('image')->store('expenses', 'public');
            $validated['image_path'] = $path;
        }

        $expense->update($validated);

        return redirect()->route('expenses.index')
            ->with('success', 'Gasto actualizado exitosamente');
    }

    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);

        // Delete image if exists
        if ($expense->image_path) {
            Storage::disk('public')->delete($expense->image_path);
        }

        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Gasto eliminado exitosamente');
    }
}
