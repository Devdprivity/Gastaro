import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AdaptiveLayout from '@/layouts/adaptive-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Mic, Camera, Hand, Bell, Wallet, TrendingDown, Calendar, CalendarDays, Plus, TrendingUp, DollarSign, Minus } from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import SharedExpensesChart from '@/components/shared-expenses-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

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
    income: number | string;
    expenses: number | string;
    available: number | string;
    count: number;
    today: number | string;
    month: number | string;
}

interface CategoryStat {
    category: string;
    total: number;
    count: number;
}

interface SharedExpense {
    id: number;
    description: string;
    amount: number;
    total_amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    other_user: {
        name: string;
        avatar: string | null;
    };
    is_owner: boolean;
    created_at: string;
}

interface DashboardProps {
    expenses: Expense[];
    stats: Stats;
    categoryStats: CategoryStat[];
    sharedExpenses: SharedExpense[];
}

const detectionIcons = {
    voice: { icon: Mic, label: 'Voz', color: 'text-blue-600' },
    ocr: { icon: Camera, label: 'OCR', color: 'text-purple-600' },
    manual: { icon: Hand, label: 'Manual', color: 'text-gray-600' },
    notification: { icon: Bell, label: 'Notificación', color: 'text-green-600' },
};

export default function Dashboard({ expenses, stats, categoryStats, sharedExpenses }: DashboardProps) {
    const { auth } = usePage<any>().props;
    const { format } = useCurrency(auth);
    const getInitials = useInitials();

    // Debug: Log auth user data
    console.log('Auth user:', auth?.user);
    console.log('Avatar URL:', auth?.user?.avatar);
    console.log('Avatar type:', typeof auth?.user?.avatar);
    console.log('Avatar truthy:', !!auth?.user?.avatar);
    console.log('Avatar length:', auth?.user?.avatar?.length);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 19) return 'Buenas tardes';
        return 'Buenas noches';
    };

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

            {/* Desktop Dashboard - Sin scroll, todo en viewport */}
            <div className="hidden md:flex h-screen flex-col p-6 overflow-hidden">
                {/* Greeting */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getGreeting()}, {auth.user.name}
                    </h1>
                </div>

                {/* Stats Cards - Layout reorganizado */}
                <div className="grid grid-cols-4 gap-0 mb-4">
                    {/* Card con Avatar - Altura completa */}
                    <div className="relative rounded-xl overflow-hidden shadow-lg h-48">
                        {/* Avatar como fondo completo del card */}
                        {auth?.user?.avatar ? (
                            <>
                                <img
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                    className="w-full h-full object-contain"
                                    onLoad={() => console.log('Avatar loaded successfully:', auth.user.avatar)}
                                    onError={(e) => {
                                        console.error('Avatar failed to load:', auth.user.avatar);
                                        console.error('Error details:', e);
                                        // Ocultar imagen y mostrar fallback
                                        e.currentTarget.style.display = 'none';
                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (fallback) {
                                            fallback.style.display = 'flex';
                                        }
                                    }}
                                />
                                {/* Fallback oculto por defecto */}
                                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
                                    <span className="text-white font-bold text-4xl">
                                        {getInitials(auth?.user?.name)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <span className="text-orange font-bold text-4xl">
                                    {getInitials(auth?.user?.name)}
                                </span>
                            </div>
                        )}
                        
                        {/* Nombre en esquina inferior derecha */}
                        <div className="absolute bottom-2 right-2 text-orange-500 text-sm font-medium">
                            {auth?.user?.name}
                        </div>
                    </div>

                    {/* Botón Nuevo Gasto */}
                    <div className="flex items-center justify-start h-48">
                        <Link
                            href="/expenses/create"
                            className="w-24 h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                        >
                            <div className="relative w-12 h-12 bg-orange-600 bg-opacity-20 rounded-full flex items-center justify-center mb-3 group-hover:bg-opacity-30 transition-all duration-300">
                                <Plus className="w-6 h-6" />                               
                            </div>
                            <h3 className="text-sm font-bold text-center">Nuevo</h3>
                            <p className="text-orange-100 text-xs text-center">Gasto</p>
                        </Link>
                    </div>

                    {/* Gastaro Pay Card */}
                    <div className="flex items-center justify-start h-48 -ml-73">
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                <p className="heading_8264">GASTARO PAY</p>
                                <svg className="logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
                                    <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
                                    <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
                                    <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
                                </svg>
                                <img src="/chip-card.png" alt="Chip de tarjeta" className="chip" />
                                <svg version="1.1" className="contactless" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50" xmlSpace="preserve">
                                    <image width="50" height="50" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJqSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKBsSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71AmzZ+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uXXSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUicUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaInKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBKxDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1NiswMDowMIXeN6gAAAAASUVORK5CYII="></image>
                                </svg>
                                <p className="number">9759 2484 5269 6576</p>
                                <p className="valid_thru">VALID THRU</p>
                                <p className="date_8264">1 2 / 30</p>
                                <p className="name">{auth?.user?.name?.toUpperCase()}</p>
                            </div>
                            <div className="flip-card-back">
                                <div className="strip"></div>
                                <div className="mstrip"></div>
                                <div className="sstrip">
                                    <p className="code">***</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Tu Balance - Al lado de Gastaro Pay */}
                    <div className="flex items-center justify-start h-48 -ml-90">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg h-full w-full">
                            <div className="flex items-center gap-2 mb-1">
                                <Wallet className="w-4 h-4 text-orange-100" />
                                <p className="text-xs text-orange-100">Tu Balance</p>
                            </div>
                            <h2 className="text-6xl font-bold flex justify-center">
                            {format(parseFloat(stats.total?.toString() || '0'))}
                        </h2>
                            <div className="text-center mt-2">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <TrendingUp className="w-3 h-3 text-orange-100" />
                                    <p className="text-orange-100 text-sm">
                                        Ingresos: {format(parseFloat(stats.income?.toString() || '0'))}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <TrendingDown className="w-3 h-3 text-orange-100" />
                                    <p className="text-orange-100 text-sm">
                                        Gastos: {format(parseFloat(stats.expenses?.toString() || '0'))}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <DollarSign className="w-3 h-3 text-orange-200" />
                                    <p className="text-orange-200 text-xs">
                                        Disponible: {format(parseFloat(stats.available?.toString() || '0'))}
                                    </p>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    </div>

                {/* Los otros 3 cards - Abajo en fila horizontal */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {/* Gastos Totales */}
                    <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm h-24">
                        <div className="flex items-center gap-1 mb-1">
                            <TrendingDown className="w-3 h-3 text-gray-500" />
                            <p className="text-xs text-gray-500">Gastos</p>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{stats.count}</h2>
                    </div>

                    {/* Hoy */}
                    <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm h-24">
                        <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <p className="text-xs text-gray-500">Hoy</p>
                        </div>
                        <h2 className="text-lg font-bold text-orange-600">
                            {format(parseFloat(stats.today?.toString() || '0'))}
                        </h2>
                    </div>

                    {/* Este Mes */}
                    <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm h-24">
                        <div className="flex items-center gap-1 mb-1">
                            <CalendarDays className="w-3 h-3 text-gray-500" />
                            <p className="text-xs text-gray-500">Este Mes</p>
                        </div>
                        <h2 className="text-lg font-bold text-green-600">
                            {format(parseFloat(stats.month?.toString() || '0'))}
                        </h2>
                    </div>
                </div>

                {/* Gastos Compartidos - Flotantes */}

                {/* Gastos Compartidos - Flotantes */}
                <div className="mb-4">
                    <SharedExpensesChart sharedExpenses={sharedExpenses} auth={auth} />
                </div>

                {/* Main Content Grid - Gastos Recientes y Gráfico de Categorías */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                        {/* Recent Expenses */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-lg font-semibold text-gray-900">Gastos Recientes</h2>
                                <Link
                                    href="/expenses"
                                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                                >
                                    Ver todas →
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
                                {expenses.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        No hay gastos registrados
                                    </div>
                                ) : (
                                    expenses.slice(0, 4).map((expense) => {
                                        const detection = expense.detected_from
                                            ? detectionIcons[expense.detected_from]
                                            : null;
                                        const DetectionIcon = detection?.icon;

                                        return (
                                            <div key={expense.id} className="p-3 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {expense.description}
                                                            </p>
                                                            {DetectionIcon && (
                                                                <DetectionIcon
                                                                    className={`w-3.5 h-3.5 flex-shrink-0 ${detection.color}`}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
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
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {format(parseFloat(expense.amount))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Category Chart - Gráfico de barras con grid y línea de tendencia */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                                <h2 className="text-lg font-semibold text-gray-900">Gastos por Categoría</h2>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                {categoryStats.length === 0 ? (
                                    <div className="text-center text-gray-500 text-sm h-full flex items-center justify-center">
                                        No hay gastos por categoría
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex">
                                        {/* Eje Y con valores */}
                                        <div className="flex flex-col justify-between pr-2 text-xs text-gray-500 w-16 flex-shrink-0">
                                            {[100, 75, 50, 25, 0].map((percent) => {
                                                const maxTotal = Math.max(...categoryStats.map(c => c.total));
                                                const value = (maxTotal * percent) / 100;
                                                return (
                                                    <div key={percent} className="text-right">
                                                        {format(value)}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Chart Area con Grid */}
                                        <div className="flex-1 relative">
                                            {/* Grid Lines horizontales */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="w-full border-b border-gray-200 border-dashed"></div>
                                                ))}
                                            </div>

                                            {/* Barras y Línea de Tendencia */}
                                            <div className="relative h-full flex items-end justify-around gap-3 pb-2">
                                                {/* Línea de tendencia */}
                                                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                                                    <polyline
                                                        points={categoryStats.map((cat, index) => {
                                                            const maxTotal = Math.max(...categoryStats.map(c => c.total));
                                                            const heightPercentage = (cat.total / maxTotal) * 100;
                                                            const x = ((index + 0.5) / categoryStats.length) * 100;
                                                            const y = 100 - heightPercentage;
                                                            return `${x},${y}`;
                                                        }).join(' ')}
                                                        fill="none"
                                                        stroke="#f97316"
                                                        strokeWidth="2"
                                                        strokeDasharray="5,5"
                                                        opacity="0.5"
                                                    />
                                                    {/* Puntos en la línea */}
                                                    {categoryStats.map((cat, index) => {
                                                        const maxTotal = Math.max(...categoryStats.map(c => c.total));
                                                        const heightPercentage = (cat.total / maxTotal) * 100;
                                                        const x = ((index + 0.5) / categoryStats.length) * 100;
                                                        const y = 100 - heightPercentage;
                                                        return (
                                                            <circle
                                                                key={cat.category}
                                                                cx={`${x}%`}
                                                                cy={`${y}%`}
                                                                r="4"
                                                                fill="#f97316"
                                                                stroke="white"
                                                                strokeWidth="2"
                                                            />
                                                        );
                                                    })}
                                            </svg>

                                                {/* Barras */}
                                                {categoryStats.map((cat, index) => {
                                                    const colors = [
                                                        { bg: 'bg-gradient-to-t from-orange-500 to-orange-400', border: 'border-orange-600' },
                                                        { bg: 'bg-gradient-to-t from-blue-500 to-blue-400', border: 'border-blue-600' },
                                                        { bg: 'bg-gradient-to-t from-green-500 to-green-400', border: 'border-green-600' },
                                                        { bg: 'bg-gradient-to-t from-purple-500 to-purple-400', border: 'border-purple-600' },
                                                        { bg: 'bg-gradient-to-t from-pink-500 to-pink-400', border: 'border-pink-600' },
                                                    ];
                                                    const maxTotal = Math.max(...categoryStats.map(c => c.total));
                                                    const heightPercentage = (cat.total / maxTotal) * 100;
                                                    const heightPixels = Math.max((heightPercentage / 100) * 200, 40); // 200px max height, 40px min
                                                    const color = colors[index % colors.length];

                                                    return (
                                                        <div key={cat.category} className="flex-1 flex flex-col items-end gap-2 group" style={{ height: '250px' }}>
                                                            {/* Barra con altura específica */}
                                                            <div
                                                                className={`${color.bg} ${color.border} border-2 rounded-t-xl w-full transition-all duration-700 ease-out hover:scale-105 relative overflow-hidden shadow-lg group-hover:shadow-xl`}
                                                                style={{
                                                                    height: `${heightPixels}px`
                                                                }}
                                                            >
                                                                {/* Efecto de brillo */}
                                                                <div className="absolute inset-0 bg-white opacity-10"></div>
                                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>

                                                                {/* Valor en la barra */}
                                                                <div className="absolute inset-0 flex items-center justify-center p-1">
                                                                    <span className="text-white font-bold text-xs text-center">
                                                                        {format(cat.total)}
                                                                    </span>
                                            </div>
                                        </div>

                                                            {/* Label de categoría */}
                                                            <div className="text-center w-full">
                                                                <p className="text-xs font-medium text-gray-900 truncate max-w-[80px] mx-auto" title={cat.category}>
                                                                {cat.category}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                    {cat.count}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                    </div>

                                            {/* Eje X inferior */}
                                            <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-300"></div>
                                        </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS para la tarjeta Gastaro Pay */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .flip-card {
                    background-color: transparent;
                    width: 320px;
                    height: 200px;
                    perspective: 1000px;
                    color: white;
                }

                .heading_8264 {
                    position: absolute;
                    letter-spacing: .2em;
                    font-size: 8px;
                    top: 20px;
                    right: 20px;
                }

                .logo {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                }

                .chip {
                    position: absolute;
                    top: 35px;
                    left: 25px;
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                }

                .contactless {
                    position: absolute;
                    top: 40px;
                    left: 85px;
                    width: 30px;
                    height: 30px;
                }

                .number {
                    position: absolute;
                    font-weight: bold;
                    font-size: 16px;
                    top: 100px;
                    left: 30px;
                    letter-spacing: 2px;
                }

                .valid_thru {
                    position: absolute;
                    font-weight: bold;
                    font-size: 8px;
                    top: 130px;
                    left: 30px;
                    letter-spacing: 1px;
                    opacity: 0.8;
                }

                .date_8264 {
                    position: absolute;
                    font-weight: bold;
                    font-size: 14px;
                    top: 135px;
                    left: 30px;
                    letter-spacing: 1px;
                }

                .name {
                    position: absolute;
                    font-weight: bold;
                    font-size: 12px;
                    bottom: 20px;
                    left: 30px;
                    letter-spacing: 1.5px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }

                .strip {
                    position: absolute;
                    width: 100%;
                    height: 45px;
                    top: 35px;
                    background: repeating-linear-gradient(
                        45deg,
                        #303030,
                        #303030 10px,
                        #202020 10px,
                        #202020 20px
                    );
                }

                .mstrip {
                    position: absolute;
                    background-color: rgb(255, 255, 255);
                    width: 180px;
                    height: 25px;
                    top: 95px;
                    left: 25px;
                    border-radius: 4px;
                }

                .sstrip {
                    position: absolute;
                    background-color: rgb(255, 255, 255);
                    width: 85px;
                    height: 25px;
                    top: 95px;
                    right: 25px;
                    border-radius: 4px;
                }

                .code {
                    font-weight: bold;
                    text-align: center;
                    margin: 0;
                    padding: 4px;
                    color: black;
                    font-size: 14px;
                }

                .flip-card-inner {
                    position: relative;
                    width: 320px;
                    height: 200px;
                    text-align: center;
                    transition: transform 0.8s;
                    transform-style: preserve-3d;
                }

                .flip-card:hover .flip-card-inner {
                    transform: rotateY(180deg);
                }

                .flip-card:not(:hover) .flip-card-inner {
                    transform: rotateY(0deg);
                }

                .flip-card-front, .flip-card-back {
                    box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 320px;
                    height: 200px;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 16px;
                }

                .flip-card-front {
                    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 2px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                }

                .flip-card-back {
                    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 2px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    transform: rotateY(180deg);
                }
                `
            }} />
        </AdaptiveLayout>
    );
}
