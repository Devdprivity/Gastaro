<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Helpers\UserCodeGenerator;
use App\Helpers\AvatarHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes([
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ])
            ->with(['access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            // Descargar y guardar avatar localmente
            $avatarUrl = $googleUser->getAvatar();
            $localAvatarPath = null;

            if ($avatarUrl) {
                // Si hay un usuario existente con avatar local, eliminarlo
                if ($user && $user->avatar && !str_starts_with($user->avatar, 'http')) {
                    AvatarHelper::delete($user->avatar);
                }

                // Crear usuario temporal si no existe para obtener el ID
                if (!$user) {
                    $tempUser = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken,
                        'avatar' => null,
                        'password' => Hash::make(Str::random(24)),
                        'email_verified_at' => now(),
                        'user_code' => UserCodeGenerator::generateUniqueCode(),
                    ]);

                    $localAvatarPath = AvatarHelper::downloadAndSave($avatarUrl, $tempUser->id);

                    $tempUser->update([
                        'avatar' => $localAvatarPath ?? $avatarUrl,
                    ]);

                    $user = $tempUser;
                } else {
                    $localAvatarPath = AvatarHelper::downloadAndSave($avatarUrl, $user->id);

                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken ?? $user->google_refresh_token,
                        'avatar' => $localAvatarPath ?? $avatarUrl,
                        'name' => $googleUser->getName(),
                    ]);
                }
            } else {
                if ($user) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken ?? $user->google_refresh_token,
                        'name' => $googleUser->getName(),
                    ]);
                } else {
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken,
                        'avatar' => null,
                        'password' => Hash::make(Str::random(24)),
                        'email_verified_at' => now(),
                        'user_code' => UserCodeGenerator::generateUniqueCode(),
                    ]);
                }
            }

            Auth::login($user, true);

            request()->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            logger()->error('Google OAuth Error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            return redirect('/login')->withErrors(['error' => 'Error al autenticar con Google: ' . $e->getMessage()]);
        }
    }
}
