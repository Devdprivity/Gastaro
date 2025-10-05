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
                <div className="flex-none space-y-3 px-3 pt-3">
                    {/* Balance Card and Add Expense Button */}
                    <div className="flex gap-3">
                        {/* Balance Card */}
                        <div className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center shadow-md">
                            <p className="text-xs text-orange-100 mb-1">Tu Balance</p>
                            <h1 className="text-3xl font-bold">
                                {format(parseFloat(stats.total?.toString() || '0'))}
                            </h1>
                        </div>

                        {/* Add Expense Button */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/expenses/create"
                                className="h-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-3 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-1 min-h-[90px]"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-xs font-medium text-center leading-tight">
                                    Ingresar<br />Gasto
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                            <div className="text-lg font-bold text-gray-900">{stats.count}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">Gastos</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                            <div className="text-lg font-bold text-orange-600">
                                {format(parseFloat(stats.today?.toString() || '0'))}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">Hoy</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                            <div className="text-lg font-bold text-green-600">
                                {format(parseFloat(stats.month?.toString() || '0'))}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">Este Mes</div>
                        </div>
                    </div>
                    </div>

                    {/* Recent Expenses - Con scroll independiente */}
                <div className="flex-1 px-3 pt-3 pb-20 overflow-hidden">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
                        <div className="flex-none p-3 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Gastos Recientes</h2>
                            <Link
                                href="/expenses"
                                className="text-xs font-medium text-orange-600 hover:text-orange-700"
                            >
                                Todas →
                            </Link>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                            {expenses.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                    No hay gastos registrados
                                </div>
                            ) : (
                                expenses.map((expense) => {
                                    const detection = expense.detected_from
                                        ? detectionIcons[expense.detected_from]
                                        : null;
                                    const DetectionIcon = detection?.icon;

                                    return (
                                        <div key={expense.id} className="p-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {expense.description}
                                                        </p>
                                                        {DetectionIcon && (
                                                            <DetectionIcon
                                                                className={`w-3.5 h-3.5 flex-shrink-0 ${detection.color}`}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
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
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-base font-bold text-gray-900">
                                                        {format(parseFloat(expense.amount))}
                                                    </p>
                                                    {expense.payment_method && (
                                                        <p className="text-[10px] text-gray-500">
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
