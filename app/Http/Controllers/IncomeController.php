<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        // Get current month and year
        $currentYear = now()->year;
        $currentMonth = now()->month;

        // Get current month's income
        $currentIncome = $request->user()
            ->incomes()
            ->where('year', $currentYear)
            ->where('month', $currentMonth)
            ->first();

        // Get all incomes for history
        $incomes = $request->user()
            ->incomes()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return Inertia::render('incomes/index', [
            'currentIncome' => $currentIncome,
            'incomes' => $incomes,
            'currentYear' => $currentYear,
            'currentMonth' => $currentMonth,
        ]);
    }

    public function create()
    {
        return Inertia::render('incomes/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'salary' => 'nullable|numeric|min:0',
            'payments' => 'nullable|numeric|min:0',
            'transfers' => 'nullable|numeric|min:0',
            'cash' => 'nullable|numeric|min:0',
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
            'notes' => 'nullable|string',
        ]);

        // Validar que al menos un campo de monto tenga valor
        if (empty($validated['salary']) && empty($validated['payments']) &&
            empty($validated['transfers']) && empty($validated['cash'])) {
            return back()->withErrors(['amount' => 'Debes ingresar al menos un monto'])->withInput();
        }

        // Establecer valores por defecto de 0 para campos vacíos
        $validated['salary'] = $validated['salary'] ?? 0;
        $validated['payments'] = $validated['payments'] ?? 0;
        $validated['transfers'] = $validated['transfers'] ?? 0;
        $validated['cash'] = $validated['cash'] ?? 0;
        $validated['user_id'] = $request->user()->id;

        $income = Income::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'year' => $validated['year'],
                'month' => $validated['month'],
            ],
            $validated
        );

        // Crear notificación
        NotificationService::createIncomeNotification($request->user(), $income);

        return redirect()->route('incomes.index')
            ->with('success', 'Ingresos registrados exitosamente');
    }

    public function update(Request $request, Income $income)
    {
        $this->authorize('update', $income);

        $validated = $request->validate([
            'salary' => 'nullable|numeric|min:0',
            'payments' => 'nullable|numeric|min:0',
            'transfers' => 'nullable|numeric|min:0',
            'cash' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Validar que al menos un campo de monto tenga valor
        if (empty($validated['salary']) && empty($validated['payments']) &&
            empty($validated['transfers']) && empty($validated['cash'])) {
            return back()->withErrors(['amount' => 'Debes ingresar al menos un monto'])->withInput();
        }

        // Establecer valores por defecto de 0 para campos vacíos
        $validated['salary'] = $validated['salary'] ?? 0;
        $validated['payments'] = $validated['payments'] ?? 0;
        $validated['transfers'] = $validated['transfers'] ?? 0;
        $validated['cash'] = $validated['cash'] ?? 0;

        $income->update($validated);

        return redirect()->route('incomes.index')
            ->with('success', 'Ingresos actualizados exitosamente');
    }

    public function destroy(Income $income)
    {
        $this->authorize('delete', $income);

        $income->delete();

        return redirect()->route('incomes.index')
            ->with('success', 'Ingresos eliminados exitosamente');
    }
}
