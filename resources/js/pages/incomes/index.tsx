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
                <div className="p-3 space-y-3 pt-3 pb-20">
                    {/* User Profile Card - Center */}
                    <div className="flex flex-col items-center justify-center py-3">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 flex items-center justify-center shadow-md mb-2">
                            {auth?.user?.avatar ? (
                                <img
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-orange-600 font-bold text-2xl">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <h2 className="text-base font-bold text-gray-900">{auth?.user?.name}</h2>
                        <p className="text-xs text-gray-500">{auth?.user?.email}</p>
                    </div>

                    {/* Current Month Income Summary */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center">
                        <p className="text-xs text-orange-100 mb-1">
                            Ingreso Total del Mes
                        </p>
                        <h1 className="text-3xl font-bold mb-0.5">
                            {format(currentIncome?.total ? parseFloat(currentIncome.total.toString()) : 0)}
                        </h1>
                        <p className="text-[10px] text-orange-100">
                            {new Date(currentYear, currentMonth - 1).toLocaleDateString('es-MX', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Income Breakdown */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Desglose de Ingresos</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-xs text-gray-600">Sueldo</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.salary) : 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-xs text-gray-600">Pagos</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.payments) : 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-xs text-gray-600">Transferencias</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.transfers) : 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5">
                                <span className="text-xs text-gray-600">Efectivo</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {format(currentIncome ? parseFloat(currentIncome.cash) : 0)}
                                </span>
                            </div>
                        </div>

                        {currentIncome?.notes && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-[10px] text-gray-500 mb-0.5">Notas:</p>
                                <p className="text-xs text-gray-700">{currentIncome.notes}</p>
                            </div>
                        )}

                        <Link
                            href="/incomes/create"
                            className="block w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-center text-sm"
                        >
                            {currentIncome ? 'Editar Ingresos' : 'Agregar Ingresos'}
                        </Link>
                    </div>

                    {/* Income History */}
                    {incomes.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="p-2.5 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900">Historial de Ingresos</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {incomes.slice(0, 6).map((income) => (
                                    <div key={income.id} className="p-3 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(income.year, income.month - 1).toLocaleDateString('es-MX', {
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    {income.month === currentMonth &&
                                                    income.year === currentYear
                                                        ? 'Mes actual'
                                                        : 'Mes anterior'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-green-600">
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
