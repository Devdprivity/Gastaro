<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    public static function createExpenseNotification(User $user, $expense)
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'expense',
            'title' => 'Nuevo gasto registrado',
            'message' => "Se registró un gasto de $" . number_format($expense->amount, 2) . " en " . $expense->category,
            'data' => [
                'expense_id' => $expense->id,
                'amount' => $expense->amount,
                'category' => $expense->category,
            ],
        ]);
    }

    public static function createIncomeNotification(User $user, $income)
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'income',
            'title' => 'Ingreso mensual registrado',
            'message' => "Se registró un ingreso de $" . number_format($income->amount, 2),
            'data' => [
                'income_id' => $income->id,
                'amount' => $income->amount,
            ],
        ]);
    }

    public static function createGastaroPayNotification(User $user, $transaction)
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'gastaro_pay',
            'title' => 'Pago con Gastaro Pay',
            'message' => "Se procesó un pago de $" . number_format($transaction['amount'], 2) . " mediante Gastaro Pay",
            'data' => $transaction,
        ]);
    }

    public static function createSharedExpenseNotification(User $user, $sharedExpense, $inviter)
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'shared_expense',
            'title' => 'Gasto compartido',
            'message' => $inviter->name . " te ha agregado a un gasto compartido de $" . number_format($sharedExpense->shared_amount ?? $sharedExpense['amount'], 2),
            'data' => [
                'shared_expense_id' => $sharedExpense->id ?? $sharedExpense['id'] ?? null,
                'inviter_name' => $inviter->name,
                'amount' => $sharedExpense->shared_amount ?? $sharedExpense['amount'],
                'status' => $sharedExpense->status ?? 'pending',
            ],
        ]);
    }

    public static function createProfileUpdateNotification(User $user, $changes)
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'profile_update',
            'title' => 'Perfil actualizado',
            'message' => 'Tu información de perfil ha sido actualizada correctamente',
            'data' => [
                'changes' => $changes,
            ],
        ]);
    }

    public static function createSharedExpenseResponseNotification(User $user, $sharedExpense, $status)
    {
        $statusText = $status === 'accepted' ? 'aceptó' : 'rechazó';
        $sharedWith = $sharedExpense->sharedWith;

        return Notification::create([
            'user_id' => $user->id,
            'type' => 'shared_expense_response',
            'title' => 'Respuesta a gasto compartido',
            'message' => $sharedWith->name . " " . $statusText . " el gasto compartido de $" . number_format($sharedExpense->shared_amount, 2),
            'data' => [
                'shared_expense_id' => $sharedExpense->id,
                'status' => $status,
                'responder_name' => $sharedWith->name,
                'amount' => $sharedExpense->shared_amount,
            ],
        ]);
    }
}
