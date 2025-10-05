<?php

namespace App\Policies;

use App\Models\Income;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IncomePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Income $income): bool
    {
        return $income->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Income $income): bool
    {
        return $income->user_id === $user->id;
    }

    public function delete(User $user, Income $income): bool
    {
        return $income->user_id === $user->id;
    }

    public function restore(User $user, Income $income): bool
    {
        return $income->user_id === $user->id;
    }

    public function forceDelete(User $user, Income $income): bool
    {
        return $income->user_id === $user->id;
    }
}
