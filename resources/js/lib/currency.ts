/**
 * Mapeo de códigos de moneda a sus símbolos
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
    ARS: '$',
    BOB: 'Bs.',
    BRL: 'R$',
    CLP: '$',
    COP: '$',
    CRC: '₡',
    CUP: '$',
    DOP: 'RD$',
    GTQ: 'Q',
    HNL: 'L',
    MXN: '$',
    NIO: 'C$',
    PAB: 'B/.',
    PYG: '₲',
    PEN: 'S/',
    USD: '$',
    UYU: '$U',
    VES: 'Bs.',
};

/**
 * Información completa de monedas de América Latina
 */
export interface CurrencyInfo {
    code: string;
    name: string;
    symbol: string;
    locale: string;
    country: string;
    flag: string;
}

export const LATIN_AMERICAN_CURRENCIES: Record<string, CurrencyInfo> = {
    ARS: {
        code: 'ARS',
        name: 'Peso Argentino',
        symbol: '$',
        locale: 'es_AR',
        country: 'Argentina',
        flag: '🇦🇷',
    },
    BOB: {
        code: 'BOB',
        name: 'Boliviano',
        symbol: 'Bs.',
        locale: 'es_BO',
        country: 'Bolivia',
        flag: '🇧🇴',
    },
    BRL: {
        code: 'BRL',
        name: 'Real Brasileño',
        symbol: 'R$',
        locale: 'pt_BR',
        country: 'Brasil',
        flag: '🇧🇷',
    },
    CLP: {
        code: 'CLP',
        name: 'Peso Chileno',
        symbol: '$',
        locale: 'es_CL',
        country: 'Chile',
        flag: '🇨🇱',
    },
    COP: {
        code: 'COP',
        name: 'Peso Colombiano',
        symbol: '$',
        locale: 'es_CO',
        country: 'Colombia',
        flag: '🇨🇴',
    },
    CRC: {
        code: 'CRC',
        name: 'Colón Costarricense',
        symbol: '₡',
        locale: 'es_CR',
        country: 'Costa Rica',
        flag: '🇨🇷',
    },
    CUP: {
        code: 'CUP',
        name: 'Peso Cubano',
        symbol: '$',
        locale: 'es_CU',
        country: 'Cuba',
        flag: '🇨🇺',
    },
    DOP: {
        code: 'DOP',
        name: 'Peso Dominicano',
        symbol: 'RD$',
        locale: 'es_DO',
        country: 'República Dominicana',
        flag: '🇩🇴',
    },
    GTQ: {
        code: 'GTQ',
        name: 'Quetzal Guatemalteco',
        symbol: 'Q',
        locale: 'es_GT',
        country: 'Guatemala',
        flag: '🇬🇹',
    },
    HNL: {
        code: 'HNL',
        name: 'Lempira Hondureño',
        symbol: 'L',
        locale: 'es_HN',
        country: 'Honduras',
        flag: '🇭🇳',
    },
    MXN: {
        code: 'MXN',
        name: 'Peso Mexicano',
        symbol: '$',
        locale: 'es_MX',
        country: 'México',
        flag: '🇲🇽',
    },
    NIO: {
        code: 'NIO',
        name: 'Córdoba Nicaragüense',
        symbol: 'C$',
        locale: 'es_NI',
        country: 'Nicaragua',
        flag: '🇳🇮',
    },
    PAB: {
        code: 'PAB',
        name: 'Balboa Panameño',
        symbol: 'B/.',
        locale: 'es_PA',
        country: 'Panamá',
        flag: '🇵🇦',
    },
    PYG: {
        code: 'PYG',
        name: 'Guaraní Paraguayo',
        symbol: '₲',
        locale: 'es_PY',
        country: 'Paraguay',
        flag: '🇵🇾',
    },
    PEN: {
        code: 'PEN',
        name: 'Sol Peruano',
        symbol: 'S/',
        locale: 'es_PE',
        country: 'Perú',
        flag: '🇵🇪',
    },
    USD: {
        code: 'USD',
        name: 'Dólar Estadounidense',
        symbol: '$',
        locale: 'es_US',
        country: 'Ecuador / El Salvador / Panamá',
        flag: '🇺🇸',
    },
    UYU: {
        code: 'UYU',
        name: 'Peso Uruguayo',
        symbol: '$U',
        locale: 'es_UY',
        country: 'Uruguay',
        flag: '🇺🇾',
    },
    VES: {
        code: 'VES',
        name: 'Bolívar Venezolano',
        symbol: 'Bs.',
        locale: 'es_VE',
        country: 'Venezuela',
        flag: '🇻🇪',
    },
};

/**
 * Formatea un número como moneda
 * @param amount - El monto a formatear
 * @param currency - El código de moneda (ej: 'CLP', 'USD', 'MXN')
 * @param locale - El locale opcional (ej: 'es_CL', 'es_MX')
 * @returns El monto formateado como string
 */
export function formatCurrency(
    amount: number,
    currency: string = 'CLP',
    locale?: string
): string {
    const currencyInfo = LATIN_AMERICAN_CURRENCIES[currency];
    const actualLocale = locale || currencyInfo?.locale || 'es_CL';

    // Convertir locale de formato PHP a JavaScript (es_CL -> es-CL)
    const jsLocale = actualLocale.replace('_', '-');

    try {
        const formatter = new Intl.NumberFormat(jsLocale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return formatter.format(amount);
    } catch (error) {
        // Fallback si el formato falla
        const symbol = CURRENCY_SYMBOLS[currency] || '$';
        return `${symbol}${amount.toLocaleString(jsLocale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}`;
    }
}

/**
 * Obtiene el símbolo de una moneda
 * @param currency - El código de moneda
 * @returns El símbolo de la moneda
 */
export function getCurrencySymbol(currency: string = 'CLP'): string {
    return CURRENCY_SYMBOLS[currency] || '$';
}

/**
 * Obtiene la información completa de una moneda
 * @param currency - El código de moneda
 * @returns La información de la moneda o undefined
 */
export function getCurrencyInfo(currency: string): CurrencyInfo | undefined {
    return LATIN_AMERICAN_CURRENCIES[currency];
}

/**
 * Hook para usar la moneda del usuario desde el contexto de la página
 */
export function useCurrency(auth?: any) {
    const currency = auth?.user?.currency || 'CLP';
    const locale = auth?.user?.locale || 'es_CL';

    return {
        currency,
        locale,
        symbol: getCurrencySymbol(currency),
        info: getCurrencyInfo(currency),
        format: (amount: number) => formatCurrency(amount, currency, locale),
    };
}
