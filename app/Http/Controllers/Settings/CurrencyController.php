<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    /**
     * Monedas de América Latina
     */
    private function getLatinAmericanCurrencies(): array
    {
        return [
            [
                'code' => 'ARS',
                'name' => 'Peso Argentino',
                'symbol' => '$',
                'country' => 'Argentina',
                'flag' => '🇦🇷',
                'locale' => 'es_AR',
            ],
            [
                'code' => 'BOB',
                'name' => 'Boliviano',
                'symbol' => 'Bs.',
                'country' => 'Bolivia',
                'flag' => '🇧🇴',
                'locale' => 'es_BO',
            ],
            [
                'code' => 'BRL',
                'name' => 'Real Brasileño',
                'symbol' => 'R$',
                'country' => 'Brasil',
                'flag' => '🇧🇷',
                'locale' => 'pt_BR',
            ],
            [
                'code' => 'CLP',
                'name' => 'Peso Chileno',
                'symbol' => '$',
                'country' => 'Chile',
                'flag' => '🇨🇱',
                'locale' => 'es_CL',
            ],
            [
                'code' => 'COP',
                'name' => 'Peso Colombiano',
                'symbol' => '$',
                'country' => 'Colombia',
                'flag' => '🇨🇴',
                'locale' => 'es_CO',
            ],
            [
                'code' => 'CRC',
                'name' => 'Colón Costarricense',
                'symbol' => '₡',
                'country' => 'Costa Rica',
                'flag' => '🇨🇷',
                'locale' => 'es_CR',
            ],
            [
                'code' => 'CUP',
                'name' => 'Peso Cubano',
                'symbol' => '$',
                'country' => 'Cuba',
                'flag' => '🇨🇺',
                'locale' => 'es_CU',
            ],
            [
                'code' => 'DOP',
                'name' => 'Peso Dominicano',
                'symbol' => 'RD$',
                'country' => 'República Dominicana',
                'flag' => '🇩🇴',
                'locale' => 'es_DO',
            ],
            [
                'code' => 'GTQ',
                'name' => 'Quetzal Guatemalteco',
                'symbol' => 'Q',
                'country' => 'Guatemala',
                'flag' => '🇬🇹',
                'locale' => 'es_GT',
            ],
            [
                'code' => 'HNL',
                'name' => 'Lempira Hondureño',
                'symbol' => 'L',
                'country' => 'Honduras',
                'flag' => '🇭🇳',
                'locale' => 'es_HN',
            ],
            [
                'code' => 'MXN',
                'name' => 'Peso Mexicano',
                'symbol' => '$',
                'country' => 'México',
                'flag' => '🇲🇽',
                'locale' => 'es_MX',
            ],
            [
                'code' => 'NIO',
                'name' => 'Córdoba Nicaragüense',
                'symbol' => 'C$',
                'country' => 'Nicaragua',
                'flag' => '🇳🇮',
                'locale' => 'es_NI',
            ],
            [
                'code' => 'PAB',
                'name' => 'Balboa Panameño',
                'symbol' => 'B/.',
                'country' => 'Panamá',
                'flag' => '🇵🇦',
                'locale' => 'es_PA',
            ],
            [
                'code' => 'PYG',
                'name' => 'Guaraní Paraguayo',
                'symbol' => '₲',
                'country' => 'Paraguay',
                'flag' => '🇵🇾',
                'locale' => 'es_PY',
            ],
            [
                'code' => 'PEN',
                'name' => 'Sol Peruano',
                'symbol' => 'S/',
                'country' => 'Perú',
                'flag' => '🇵🇪',
                'locale' => 'es_PE',
            ],
            [
                'code' => 'USD',
                'name' => 'Dólar Estadounidense',
                'symbol' => '$',
                'country' => 'Ecuador / El Salvador / Panamá',
                'flag' => '🇺🇸',
                'locale' => 'es_US',
            ],
            [
                'code' => 'UYU',
                'name' => 'Peso Uruguayo',
                'symbol' => '$U',
                'country' => 'Uruguay',
                'flag' => '🇺🇾',
                'locale' => 'es_UY',
            ],
            [
                'code' => 'VES',
                'name' => 'Bolívar Venezolano',
                'symbol' => 'Bs.',
                'country' => 'Venezuela',
                'flag' => '🇻🇪',
                'locale' => 'es_VE',
            ],
        ];
    }

    /**
     * Mostrar la página de configuración de moneda
     */
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('settings/currency', [
            'currencies' => $this->getLatinAmericanCurrencies(),
            'currentCurrency' => [
                'code' => $user->currency,
                'locale' => $user->locale,
            ],
        ]);
    }

    /**
     * Actualizar la moneda del usuario
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'currency' => 'required|string|size:3',
            'locale' => 'required|string|max:5',
        ]);

        $user = $request->user();
        $user->update([
            'currency' => $validated['currency'],
            'locale' => $validated['locale'],
        ]);

        return redirect()->route('settings.currency')
            ->with('success', 'Moneda actualizada exitosamente');
    }
}
