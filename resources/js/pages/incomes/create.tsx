import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, DollarSign, Calendar, Tag, CreditCard, FileText, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '@/lib/currency';

export default function IncomeCreate() {
    const { auth } = usePage<any>().props;
    const { symbol, format } = useCurrency(auth);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;

    const { data, setData, post, processing, errors } = useForm({
        salary: '',
        payments: '',
        transfers: '',
        cash: '',
        year: currentYear,
        month: currentMonthNum,
        notes: '',
    });

    const [displayValues, setDisplayValues] = useState({
        salary: '',
        payments: '',
        transfers: '',
        cash: '',
    });

    const formatNumber = (value: string) => {
        // Remove all non-numeric characters except decimal point
        const cleaned = value.replace(/[^\d.]/g, '');
        // Ensure only one decimal point
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('');
        }
        return cleaned;
    };

    const formatForDisplay = (value: string) => {
        if (!value) return '';
        const num = parseFloat(value);
        if (isNaN(num)) return '';
        return num.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleAmountChange = (field: 'salary' | 'payments' | 'transfers' | 'cash', value: string) => {
        const cleaned = formatNumber(value);
        setData(field, cleaned);
        setDisplayValues(prev => ({
            ...prev,
            [field]: cleaned,
        }));
    };

    const handleAmountBlur = (field: 'salary' | 'payments' | 'transfers' | 'cash') => {
        const value = data[field];
        if (value) {
            setDisplayValues(prev => ({
                ...prev,
                [field]: formatForDisplay(value),
            }));
        }
    };

    const handleAmountFocus = (field: 'salary' | 'payments' | 'transfers' | 'cash') => {
        setDisplayValues(prev => ({
            ...prev,
            [field]: data[field],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que al menos un campo tenga valor
        const hasValue = data.salary || data.payments || data.transfers || data.cash;

        if (!hasValue) {
            alert('Debes ingresar al menos un monto');
            return;
        }

        post('/incomes');
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    return (
        <AdaptiveLayout>
            <Head title="Nuevo Ingreso" />

            {/* Mobile View */}
            <div className="md:hidden h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-none bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/incomes"
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Nuevo Ingreso</h1>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Period Selection */}
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Período
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mes *
                                    </label>
                                    <select
                                        value={data.month}
                                        onChange={(e) => setData('month', parseInt(e.target.value))}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white text-sm font-medium"
                                        required
                                    >
                                        {months.map((month, index) => (
                                            <option key={index} value={index + 1}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.month && (
                                        <p className="mt-1 text-xs text-red-600">{errors.month}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Año *
                                    </label>
                                    <select
                                        value={data.year}
                                        onChange={(e) => setData('year', parseInt(e.target.value))}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white text-sm font-medium"
                                        required
                                    >
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.year && (
                                        <p className="mt-1 text-xs text-red-600">{errors.year}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Salary and Payments - Side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Sueldo
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base font-semibold text-orange-600">
                                        {symbol}
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={displayValues.salary}
                                        onChange={(e) => handleAmountChange('salary', e.target.value)}
                                        onBlur={() => handleAmountBlur('salary')}
                                        onFocus={() => handleAmountFocus('salary')}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-semibold bg-white text-orange-600"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                                {errors.salary && (
                                    <p className="mt-1 text-xs text-red-600">{errors.salary}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CreditCard className="w-4 h-4 inline mr-1" />
                                    Pagos
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base font-semibold text-orange-600">
                                        {symbol}
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={displayValues.payments}
                                        onChange={(e) => handleAmountChange('payments', e.target.value)}
                                        onBlur={() => handleAmountBlur('payments')}
                                        onFocus={() => handleAmountFocus('payments')}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-semibold bg-white text-orange-600"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.payments && (
                                    <p className="mt-1 text-xs text-red-600">{errors.payments}</p>
                                )}
                            </div>
                        </div>

                        {/* Transfers and Cash - Side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 inline mr-1" />
                                    Transferencias
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base font-semibold text-orange-600">
                                        {symbol}
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={displayValues.transfers}
                                        onChange={(e) => handleAmountChange('transfers', e.target.value)}
                                        onBlur={() => handleAmountBlur('transfers')}
                                        onFocus={() => handleAmountFocus('transfers')}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-semibold bg-white text-orange-600"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.transfers && (
                                    <p className="mt-1 text-xs text-red-600">{errors.transfers}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Efectivo
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base font-semibold text-orange-600">
                                        {symbol}
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={displayValues.cash}
                                        onChange={(e) => handleAmountChange('cash', e.target.value)}
                                        onBlur={() => handleAmountBlur('cash')}
                                        onFocus={() => handleAmountFocus('cash')}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-semibold bg-white text-orange-600"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.cash && (
                                    <p className="mt-1 text-xs text-red-600">{errors.cash}</p>
                                )}
                            </div>
                        </div>

                        {/* Notes - Full width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white text-orange-600"
                                placeholder="Notas adicionales sobre tus ingresos del mes..."
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                            )}
                        </div>

                        {/* Total Preview */}
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Total del Mes</span>
                                <span className="text-2xl font-bold text-orange-600">
                                    {format(
                                        parseFloat(data.salary || '0') +
                                        parseFloat(data.payments || '0') +
                                        parseFloat(data.transfers || '0') +
                                        parseFloat(data.cash || '0')
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-auto px-8 mx-auto block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Guardando...' : 'Guardar Ingresos'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Desktop View - Placeholder */}
            <div className="hidden md:block p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Nuevo Ingreso</h1>
                    <p className="text-gray-600">Vista de escritorio en desarrollo...</p>
                </div>
            </div>
        </AdaptiveLayout>
    );
}
