import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AdaptiveLayout from '@/layouts/adaptive-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Mic, Camera, Hand, Bell } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Expense {
    id: number;
    amount: string;
    description: string;
    category: string | null;
    expense_date: string;
    payment_method: string | null;
    detected_from: 'voice' | 'ocr' | 'manual' | 'notification' | null;
    raw_data: any;
}

interface Stats {
    total: number | string;
    count: number;
    today: number | string;
    month: number | string;
}

interface DashboardProps {
    expenses: Expense[];
    stats: Stats;
}

const detectionIcons = {
    voice: { icon: Mic, label: 'Voz', color: 'text-blue-600' },
    ocr: { icon: Camera, label: 'OCR', color: 'text-purple-600' },
    manual: { icon: Hand, label: 'Manual', color: 'text-gray-600' },
    notification: { icon: Bell, label: 'Notificación', color: 'text-green-600' },
};

export default function Dashboard({ expenses, stats }: DashboardProps) {
    const { auth } = usePage<any>().props;
    const { format } = useCurrency(auth);

    return (
        <AdaptiveLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Mobile Dashboard */}
            <div className="md:hidden h-full flex flex-col overflow-hidden">
                <div className="flex-none space-y-4 px-4 pt-4">
                    {/* Balance Card and Add Expense Button */}
                    <div className="flex gap-4">
                        {/* Balance Card */}
                        <div className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center shadow-lg">
                            <p className="text-sm text-orange-100 mb-2">Tu Balance</p>
                            <h1 className="text-4xl font-bold">
                                {format(parseFloat(stats.total?.toString() || '0'))}
                            </h1>
                        </div>

                        {/* Add Expense Button */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/expenses/create"
                                className="h-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col items-center justify-center gap-2 min-h-[120px]"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm font-medium text-center leading-tight">
                                    Ingresar<br />Gasto
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                            <div className="text-xl font-bold text-gray-900">{stats.count}</div>
                            <div className="text-xs text-gray-500 mt-1">Gastos</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                            <div className="text-xl font-bold text-orange-600">
                                {format(parseFloat(stats.today?.toString() || '0'))}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Hoy</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                            <div className="text-xl font-bold text-green-600">
                                {format(parseFloat(stats.month?.toString() || '0'))}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Este Mes</div>
                        </div>
                    </div>
                    </div>

                    {/* Recent Expenses - Con scroll independiente */}
                <div className="flex-1 px-4 pt-4 pb-24 overflow-hidden">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
                        <div className="flex-none p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Gastos Recientes</h2>
                            <Link
                                href="/expenses"
                                className="text-sm font-medium text-orange-600 hover:text-orange-700"
                            >
                                Todas →
                            </Link>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                            {expenses.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No hay gastos registrados
                                </div>
                            ) : (
                                expenses.map((expense) => {
                                    const detection = expense.detected_from
                                        ? detectionIcons[expense.detected_from]
                                        : null;
                                    const DetectionIcon = detection?.icon;

                                    return (
                                        <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {expense.description}
                                                        </p>
                                                        {DetectionIcon && (
                                                            <DetectionIcon
                                                                className={`w-4 h-4 flex-shrink-0 ${detection.color}`}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
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
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {format(parseFloat(expense.amount))}
                                                    </p>
                                                    {expense.payment_method && (
                                                        <p className="text-xs text-gray-500">
                                                            {expense.payment_method}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Dashboard */}
            <div className="hidden md:flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AdaptiveLayout>
    );
}
