import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Coins, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Currency {
    code: string;
    name: string;
    symbol: string;
    country: string;
    flag: string;
    locale: string;
}

interface Props {
    currencies: Currency[];
    currentCurrency: {
        code: string;
        locale: string;
    };
}

export default function CurrencySettings({ currencies, currentCurrency }: Props) {
    const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency.code);

    const handleCurrencyChange = (currency: Currency) => {
        setSelectedCurrency(currency.code);

        router.post('/settings/currency', {
            currency: currency.code,
            locale: currency.locale,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Opcional: mostrar mensaje de éxito
            },
        });
    };

    return (
        <AdaptiveLayout>
            <Head title="Configuración de Moneda" />

            {/* Mobile View */}
            <div className="md:hidden h-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/settings/profile"
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </Link>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Moneda</h1>
                            <p className="text-sm text-gray-600">Selecciona tu moneda local</p>
                        </div>
                    </div>
                </div>

                {/* Currency List */}
                <div className="flex-1 overflow-y-auto pb-24 px-4 py-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {currencies.map((currency, index) => (
                            <button
                                key={currency.code}
                                onClick={() => handleCurrencyChange(currency)}
                                className={`w-full flex items-center justify-between p-4 transition-colors ${
                                    index !== currencies.length - 1 ? 'border-b border-gray-200' : ''
                                } ${
                                    selectedCurrency === currency.code
                                        ? 'bg-orange-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{currency.flag}</span>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">
                                                {currency.code}
                                            </p>
                                            <span className="text-sm text-gray-500">
                                                {currency.symbol}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{currency.name}</p>
                                        <p className="text-xs text-gray-500">{currency.country}</p>
                                    </div>
                                </div>
                                {selectedCurrency === currency.code && (
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Info Card */}
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Coins className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 mb-1">
                                    ¿Por qué configurar mi moneda?
                                </h3>
                                <p className="text-sm text-blue-700">
                                    Todos los montos en la aplicación se mostrarán con el formato y símbolo
                                    de tu moneda local. Esto hace más fácil registrar y visualizar tus gastos
                                    e ingresos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Link
                            href="/settings/profile"
                            className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </Link>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Coins className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Configuración de Moneda</h1>
                            <p className="text-gray-600">Selecciona tu moneda local</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currencies.map((currency) => (
                                <button
                                    key={currency.code}
                                    onClick={() => handleCurrencyChange(currency)}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                        selectedCurrency === currency.code
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{currency.flag}</span>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900">
                                                    {currency.code}
                                                </p>
                                                <span className="text-sm text-gray-500">
                                                    {currency.symbol}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{currency.name}</p>
                                        </div>
                                    </div>
                                    {selectedCurrency === currency.code && (
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdaptiveLayout>
    );
}
