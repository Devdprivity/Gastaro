import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useCurrency } from '@/lib/currency';

interface Income {
    id: number;
    salary: string;
    payments: string;
    transfers: string;
    cash: string;
    year: number;
    month: number;
    notes: string | null;
    total: number;
}

interface IncomesIndexProps {
    currentIncome: Income | null;
    incomes: Income[];
    currentYear: number;
    currentMonth: number;
}

export default function IncomesIndex({
    currentIncome,
    incomes,
    currentYear,
    currentMonth,
}: IncomesIndexProps) {
    const { auth } = usePage().props as any;
    const { format } = useCurrency(auth);

    return (
        <AdaptiveLayout>
            <Head title="Ingresos" />

            {/* Mobile View */}
            <div className="md:hidden min-h-screen bg-gray-50">
                <div className="p-4 space-y-6 pt-4">
                    {/* User Profile Card - Center */}
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500 bg-orange-100 flex items-center justify-center shadow-lg mb-3">
                            {auth?.user?.avatar ? (
                                <img
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-orange-600 font-bold text-3xl">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{auth?.user?.name}</h2>
                        <p className="text-sm text-gray-500">{auth?.user?.email}</p>
                    </div>

                    {/* Current Month Income Summary */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center">
                        <p className="text-sm text-orange-100 mb-2">
                            Ingreso Total del Mes
                        </p>
                        <h1 className="text-4xl font-bold mb-1">
                            {format(currentIncome?.total ? parseFloat(currentIncome.total.toString()) : 0)}
                        </h1>
                        <p className="text-xs text-orange-100">
                            {new Date(currentYear, currentMonth - 1).toLocaleDateString('es-MX', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Income Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Desglose de Ingresos</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Sueldo</span>
                                <span className="font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.salary) : 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Pagos</span>
                                <span className="font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.payments) : 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Transferencias</span>
                                <span className="font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.transfers) : 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">Efectivo</span>
                                <span className="font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.cash) : 0)}
                                </span>
                            </div>
                        </div>

                        {currentIncome?.notes && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Notas:</p>
                                <p className="text-sm text-gray-700">{currentIncome.notes}</p>
                            </div>
                        )}

                        <Link
                            href="/incomes/create"
                            className="block w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
                        >
                            {currentIncome ? 'Editar Ingresos' : 'Agregar Ingresos'}
                        </Link>
                    </div>

                    {/* Income History */}
                    {incomes.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">Historial de Ingresos</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {incomes.slice(0, 6).map((income) => (
                                    <div key={income.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(income.year, income.month - 1).toLocaleDateString('es-MX', {
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {income.month === currentMonth &&
                                                    income.year === currentYear
                                                        ? 'Mes actual'
                                                        : 'Mes anterior'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-green-600">
                                                    {format(income.total ? parseFloat(income.total.toString()) : 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop View - Placeholder */}
            <div className="hidden md:block p-8">
                <h1 className="text-2xl font-bold mb-4">Ingresos</h1>
                <p className="text-gray-600">Vista de escritorio en desarrollo...</p>
            </div>
        </AdaptiveLayout>
    );
}
