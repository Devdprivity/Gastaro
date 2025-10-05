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

        // Actualizar la notificación original a aceptada
        $notification = auth()->user()
            ->notifications()
            ->where('type', 'shared_expense')
            ->whereJsonContains('data->shared_expense_id', $sharedExpense->id)
            ->first();

        if ($notification) {
            $data = $notification->data;
            $data['status'] = 'accepted';
            $notification->update([
                'data' => $data,
                'read' => true,
                'read_at' => now(),
            ]);
        }

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

        // Actualizar la notificación original a rechazada
        $notification = auth()->user()
            ->notifications()
            ->where('type', 'shared_expense')
            ->whereJsonContains('data->shared_expense_id', $sharedExpense->id)
            ->first();

        if ($notification) {
            $data = $notification->data;
            $data['status'] = 'rejected';
            $notification->update([
                'data' => $data,
                'read' => true,
                'read_at' => now(),
            ]);
        }

        // Notificar al creador que su gasto fue rechazado
        NotificationService::createSharedExpenseResponseNotification(
            $sharedExpense->owner,
            $sharedExpense,
            'rejected'
        );

        return back()->with('success', 'Gasto compartido rechazado');
    }
}
