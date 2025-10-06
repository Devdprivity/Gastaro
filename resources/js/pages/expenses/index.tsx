import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface Expense {
    id: number;
    amount: string;
    description: string;
    category: string | null;
    expense_date: string;
    payment_method: string | null;
    detected_from: 'voice' | 'ocr' | 'manual' | 'notification' | null;
}

interface ChartDataItem {
    date: string;
    total: number;
}

interface Stats {
    income: number | string;
    expenses: number | string;
}

interface ExpensesIndexProps {
    expenses: {
        data: Expense[];
        links: unknown;
        meta: unknown;
    };
    stats: Stats;
    chartData: ChartDataItem[];
}

export default function ExpensesIndex({ expenses, stats, chartData }: ExpensesIndexProps) {
    const { auth } = usePage<any>().props;
    const { format } = useCurrency(auth);

    // Format chart data for display
    const formattedChartData = chartData.map((item) => ({
        date: new Date(item.date).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
        }),
        total: item.total,
    }));

    return (
        <AdaptiveLayout>
            <Head title="Transacciones" />

            {/* Mobile View */}
            <div className="md:hidden h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-none bg-white border-b border-gray-200 px-3 py-3">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard"
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-700" />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900">Transacciones</h1>
                    </div>
                </div>

                {/* Stats and Chart - Fixed */}
                <div className="flex-none p-3 space-y-3">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-xs text-gray-600">Ingresos</span>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                                {format(parseFloat(stats.income?.toString() || '0'))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                    <TrendingDown className="w-3 h-3 text-orange-600" />
                                </div>
                                <span className="text-xs text-gray-600">Gastos</span>
                            </div>
                            <div className="text-lg font-bold text-orange-600">
                                {format(parseFloat(stats.expenses?.toString() || '0'))}
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <h2 className="text-xs font-semibold text-gray-900 mb-2">
                            Últimos 7 días
                        </h2>
                        <div className="w-full h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={formattedChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        style={{ fontSize: '10px' }}
                                    />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '11px'
                                        }}
                                        formatter={(value: number) => format(value)}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        dot={{ fill: '#f97316', r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Transactions List - Scrollable */}
                <div className="flex-1 px-3 pb-20 overflow-hidden">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
                        <div className="flex-none p-2.5 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-900">Todas las transacciones</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                            {expenses.data.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                    No hay transacciones registradas
                                </div>
                            ) : (
                                expenses.data.map((expense) => (
                                    <div key={expense.id} className="p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {expense.description}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                                                    {expense.category && (
                                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                                                            {expense.category}
                                                        </span>
                                                    )}
                                                    <span>
                                                        {new Date(
                                                            expense.expense_date
                                                        ).toLocaleDateString('es-MX', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-base font-bold text-orange-600">
                                                    -{format(parseFloat(expense.amount))}
                                                </p>
                                                {expense.payment_method && (
                                                    <p className="text-[10px] text-gray-500">
                                                        {expense.payment_method}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex h-screen flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">Ingresos</span>
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                            {format(parseFloat(stats.income?.toString() || '0'))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-orange-600" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">Gastos</span>
                        </div>
                        <div className="text-3xl font-bold text-orange-600">
                            {format(parseFloat(stats.expenses?.toString() || '0'))}
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Últimos 7 días
                    </h2>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '13px'
                                    }}
                                    formatter={(value: number) => format(value)}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    dot={{ fill: '#f97316', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 min-h-0 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900">Todas las transacciones</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                        {expenses.data.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No hay transacciones registradas
                            </div>
                        ) : (
                            expenses.data.map((expense) => (
                                <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {expense.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                {expense.category && (
                                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                                        {expense.category}
                                                    </span>
                                                )}
                                                <span>
                                                    {new Date(
                                                        expense.expense_date
                                                    ).toLocaleDateString('es-MX', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-base font-bold text-orange-600">
                                                -{format(parseFloat(expense.amount))}
                                            </p>
                                            {expense.payment_method && (
                                                <p className="text-xs text-gray-500">
                                                    {expense.payment_method}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdaptiveLayout>
    );
}
