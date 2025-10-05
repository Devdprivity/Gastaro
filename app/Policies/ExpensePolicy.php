<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;

class ExpensePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Expense $expense): bool
    {
        return $expense->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Expense $expense): bool
    {
        return $expense->user_id === $user->id;
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $expense->user_id === $user->id;
    }

    public function restore(User $user, Expense $expense): bool
    {
        return $expense->user_id === $user->id;
    }

    public function forceDelete(User $user, Expense $expense): bool
    {
        return $expense->user_id === $user->id;
    }
}
