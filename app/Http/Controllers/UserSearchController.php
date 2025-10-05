<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserSearchController extends Controller
{
    /**
     * Buscar usuario por código único
     */
    public function searchByCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|size:8|regex:/^[A-Z0-9]+$/'
        ]);

        $user = User::where('user_code', strtoupper($request->code))->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        // Verificar que no sea el mismo usuario
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes buscarte a ti mismo'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'user_code' => $user->user_code,
                'avatar' => $user->avatar,
            ]
        ]);
    }

    /**
     * Obtener información del usuario actual
     */
    public function getCurrentUser(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'user_code' => $user->user_code,
                'avatar' => $user->avatar,
                'email' => $user->email,
            ]
        ]);
    }

    /**
     * Crear un gasto compartido
     * Este método será implementado cuando se desarrolle la funcionalidad completa de gastos compartidos
     */
    public function createSharedExpense(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
        ]);

        // Buscar al usuario con quien se compartirá el gasto
        $sharedUser = User::findOrFail($validated['user_id']);

        // Aquí iría la lógica para crear el gasto compartido
        // Por ahora solo creamos la notificación

        $sharedExpense = [
            'id' => uniqid(),
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'inviter_id' => auth()->id(),
            'shared_with_id' => $sharedUser->id,
        ];

        // Crear notificación para el usuario con quien se comparte
        NotificationService::createSharedExpenseNotification(
            $sharedUser,
            $sharedExpense,
            auth()->user()
        );

        return response()->json([
            'success' => true,
            'message' => 'Gasto compartido creado exitosamente',
        ]);
    }
}