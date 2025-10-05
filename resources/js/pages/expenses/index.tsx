import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
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
                <div className="flex-none bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Transacciones</h1>
                    </div>
                </div>

                {/* Stats and Chart - Fixed */}
                <div className="flex-none p-4 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm text-gray-600">Ingresos</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                ${parseFloat(stats.income?.toString() || '0').toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                    <TrendingDown className="w-4 h-4 text-orange-600" />
                                </div>
                                <span className="text-sm text-gray-600">Gastos</span>
                            </div>
                            <div className="text-2xl font-bold text-orange-600">
                                ${parseFloat(stats.expenses?.toString() || '0').toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">
                            Últimos 7 días
                        </h2>
                        <div className="w-full h-48">
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
                                        }}
                                        formatter={(value: number) => `$${value.toFixed(2)}`}
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
                </div>

                {/* Transactions List - Scrollable */}
                <div className="flex-1 px-4 pb-24 overflow-hidden">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
                        <div className="flex-none p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900">Todas las transacciones</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                            {expenses.data.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No hay transacciones registradas
                                </div>
                            ) : (
                                expenses.data.map((expense) => (
                                    <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {expense.description}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    {expense.category && (
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded">
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
                                                <p className="text-lg font-bold text-orange-600">
                                                    -${parseFloat(expense.amount).toFixed(2)}
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
            </div>

            {/* Desktop View - Placeholder */}
            <div className="hidden md:block p-8">
                <h1 className="text-2xl font-bold mb-4">Transacciones</h1>
                <p className="text-gray-600">Vista de escritorio en desarrollo...</p>
            </div>
        </AdaptiveLayout>
    );
}
