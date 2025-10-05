<?php

use App\Http\Controllers\ExpenseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('welcome', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('welcome');

    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

            Route::resource('expenses', ExpenseController::class);
            Route::resource('incomes', \App\Http\Controllers\IncomeController::class)->only(['index', 'create', 'store', 'update', 'destroy']);
            Route::get('settings', [\App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
            Route::get('gastaro-pay', [\App\Http\Controllers\GastaroPayController::class, 'index'])->name('gastaro-pay.index');
    
    // Rutas para búsqueda de usuarios
    Route::get('user/current', [\App\Http\Controllers\UserSearchController::class, 'getCurrentUser'])->name('user.current');
    Route::post('user/search', [\App\Http\Controllers\UserSearchController::class, 'searchByCode'])->name('user.search');
    Route::get('users/search', [\App\Http\Controllers\UserSearchViewController::class, 'index'])->name('users.search');

    // Rutas para notificaciones
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/unread-count', [\App\Http\Controllers\NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
    Route::post('notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Rutas para gastos compartidos
    Route::post('shared-expenses/create', [\App\Http\Controllers\SharedExpenseCreateController::class, 'store'])->name('shared-expenses.create');
    Route::post('shared-expenses/{sharedExpense}/accept', [\App\Http\Controllers\SharedExpenseController::class, 'accept'])->name('shared-expenses.accept');
    Route::post('shared-expenses/{sharedExpense}/reject', [\App\Http\Controllers\SharedExpenseController::class, 'reject'])->name('shared-expenses.reject');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
