<?php

namespace App\Http\Controllers;

use App\Models\SharedExpense;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class SharedExpenseController extends Controller
{
    public function accept(Request $request, SharedExpense $sharedExpense)
    {
        // Verificar que el usuario sea el destinatario
        if ($sharedExpense->shared_with_id !== auth()->id()) {
            abort(403, 'No autorizado');
        }

        // Aceptar el gasto compartido
        $sharedExpense->accept();

        // Notificar al creador que su gasto fue aceptado
        NotificationService::createSharedExpenseResponseNotification(
            $sharedExpense->owner,
            $sharedExpense,
            'accepted'
        );

        return back()->with('success', 'Gasto compartido aceptado');
    }

    public function reject(Request $request, SharedExpense $sharedExpense)
    {
        // Verificar que el usuario sea el destinatario
        if ($sharedExpense->shared_with_id !== auth()->id()) {
            abort(403, 'No autorizado');
        }

        // Rechazar el gasto compartido
        $sharedExpense->reject();

        // Notificar al creador que su gasto fue rechazado
        NotificationService::createSharedExpenseResponseNotification(
            $sharedExpense->owner,
            $sharedExpense,
            'rejected'
        );

        return back()->with('success', 'Gasto compartido rechazado');
    }
}
