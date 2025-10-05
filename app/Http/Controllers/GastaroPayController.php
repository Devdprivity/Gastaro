<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GastaroPayController extends Controller
{
    /**
     * Mostrar la vista de Gastaro Pay
     */
    public function index()
    {
        return Inertia::render('gastaro-pay', [
            'auth' => [
                'user' => [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'avatar' => auth()->user()->avatar,
                ]
            ]
        ]);
    }

    /**
     * Procesar un pago con Gastaro Pay
     * Este método será implementado cuando se desarrolle la funcionalidad completa
     */
    public function processPayment(Request $request)
    {
        // Validación de los datos del pago
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'recipient' => 'required|string',
            'description' => 'nullable|string',
        ]);

        // Aquí iría la lógica para procesar el pago
        // Por ahora solo creamos la notificación

        $transaction = [
            'amount' => $validated['amount'],
            'recipient' => $validated['recipient'],
            'description' => $validated['description'] ?? 'Pago realizado',
            'status' => 'completed',
            'date' => now()->toISOString(),
        ];

        // Crear notificación
        NotificationService::createGastaroPayNotification($request->user(), $transaction);

        return response()->json([
            'success' => true,
            'message' => 'Pago procesado exitosamente',
        ]);
    }
}
