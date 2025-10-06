<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AvatarHelper
{
    /**
     * Descarga un avatar desde una URL y lo guarda localmente
     *
     * @param string $url URL del avatar a descargar
     * @param int $userId ID del usuario
     * @return string|null Ruta del archivo guardado o null si falla
     */
    public static function downloadAndSave(string $url, int $userId): ?string
    {
        try {
            // Obtener el contenido de la imagen
            $contents = file_get_contents($url);

            if ($contents === false) {
                return null;
            }

            // Generar un nombre único para el archivo
            $extension = 'jpg'; // Por defecto jpg para avatares de Google
            $filename = "avatar_{$userId}_" . Str::random(10) . ".{$extension}";
            $path = "avatars/{$filename}";

            // Guardar en storage/app/public/avatars
            Storage::disk('public')->put($path, $contents);

            // Retornar la ruta pública
            return "/storage/{$path}";
        } catch (\Exception $e) {
            logger()->error('Error downloading avatar: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Elimina un avatar antiguo si existe
     *
     * @param string|null $avatarPath Ruta del avatar a eliminar
     * @return void
     */
    public static function delete(?string $avatarPath): void
    {
        if (!$avatarPath) {
            return;
        }

        // Si es una URL de Google, no intentar eliminar
        if (str_starts_with($avatarPath, 'http')) {
            return;
        }

        // Eliminar el archivo del storage
        $path = str_replace('/storage/', '', $avatarPath);
        Storage::disk('public')->delete($path);
    }
}
