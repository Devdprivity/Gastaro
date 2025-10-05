<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Helpers\UserCodeGenerator;
use Illuminate\Console\Command;

class GenerateUserCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:generate-codes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera códigos únicos para usuarios existentes que no tienen user_code';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $usersWithoutCode = User::where(function($query) {
            $query->whereNull('user_code')
                  ->orWhere('user_code', '');
        })->get();
        
        if ($usersWithoutCode->isEmpty()) {
            $this->info('Todos los usuarios ya tienen códigos únicos asignados.');
            return;
        }

        $this->info("Generando códigos únicos para {$usersWithoutCode->count()} usuarios...");

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
        $this->info('¡Códigos únicos generados exitosamente!');
    }
}
