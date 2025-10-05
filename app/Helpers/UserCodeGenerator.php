<?php

namespace App\Helpers;

use App\Models\User;

class UserCodeGenerator
{
    /**
     * Genera un código único de 8 caracteres (letras y números)
     */
    public static function generateUniqueCode(): string
    {
        do {
            $code = self::generateRandomCode();
        } while (User::where('user_code', $code)->exists());

        return $code;
    }

    /**
     * Genera un código aleatorio de 8 caracteres
     */
    private static function generateRandomCode(): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $code = '';
        
        for ($i = 0; $i < 8; $i++) {
            $code .= $characters[random_int(0, strlen($characters) - 1)];
        }
        
        return $code;
    }
}
