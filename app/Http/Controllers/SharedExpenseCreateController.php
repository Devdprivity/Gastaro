<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\SharedExpense;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SharedExpenseCreateController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shared_with_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'category' => 'nullable|string',
            'expense_date' => 'required|date',
            'split_type' => 'required|in:50/50,custom',
            'owner_amount' => 'nullable|numeric|min:0',
            'shared_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        // Calculate amounts based on split type
        $totalAmount = $validated['amount'];
        if ($validated['split_type'] === '50/50') {
            $ownerAmount = $totalAmount / 2;
            $sharedAmount = $totalAmount / 2;
        } else {
            $ownerAmount = $validated['owner_amount'] ?? 0;
            $sharedAmount = $validated['shared_amount'] ?? 0;
        }

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('expenses', 'public');
        }

        // Create the shared expense (NO crear Expense todavía, solo guardar la info)
        $sharedExpense = SharedExpense::create([
            'expense_id' => null, // Se creará cuando se acepte
            'owner_id' => $request->user()->id,
            'shared_with_id' => $validated['shared_with_id'],
            'owner_amount' => $ownerAmount,
            'shared_amount' => $sharedAmount,
            'status' => 'pending',
            // Guardar datos del gasto para crear después
            'expense_data' => json_encode([
                'amount' => $totalAmount,
                'description' => $validated['description'],
                'category' => $validated['category'],
                'expense_date' => $validated['expense_date'],
                'notes' => $validated['notes'],
                'image' => $imagePath,
            ]),
        ]);

        // Crear notificación para el usuario con quien se comparte
        NotificationService::createSharedExpenseNotification(
            $sharedExpense->sharedWith,
            $sharedExpense,
            $request->user()
        );

        return redirect()->route('users.search')
            ->with('success', 'Gasto compartido creado exitosamente');
    }
}
