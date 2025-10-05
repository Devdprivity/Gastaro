<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Helpers\UserCodeGenerator;
use Illuminate\Console\Command;

class CheckUserCodes extends Command
{
    protected $signature = 'users:check-codes';
    protected $description = 'Verifica y asigna códigos únicos a usuarios que no los tienen';

    public function handle()
    {
        $usersWithoutCode = User::where(function($query) {
            $query->whereNull('user_code')
                  ->orWhere('user_code', '');
        })->get();
        
        $this->info("Usuarios encontrados sin código: {$usersWithoutCode->count()}");
        
        if ($usersWithoutCode->isEmpty()) {
            $this->info('Todos los usuarios ya tienen códigos únicos asignados.');
            return;
        }

        foreach ($usersWithoutCode as $user) {
            $this->info("Usuario sin código: {$user->name} ({$user->email})");
        }

        if ($this->confirm('¿Desea asignar códigos únicos a estos usuarios?')) {
            $bar = $this->output->createProgressBar($usersWithoutCode->count());
            $bar->start();

            foreach ($usersWithoutCode as $user) {
                $user->update([
                    'user_code' => UserCodeGenerator::generateUniqueCode()
                ]);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info('¡Códigos únicos asignados exitosamente!');
        }
    }
}