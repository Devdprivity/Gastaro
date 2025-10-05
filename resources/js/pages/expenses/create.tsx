import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, DollarSign, Calendar, Tag, CreditCard, FileText, Camera, ChevronLeft, ChevronRight, Users, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '@/lib/currency';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    user_code: string;
}

export default function ExpenseCreate() {
    const { auth } = usePage<any>().props;
    const { symbol } = useCurrency(auth);

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
        category: '',
        expense_date: new Date().toISOString().split('T')[0], // Today's date
        payment_method: '',
        notes: '',
        image: null as File | null,
        // Campos para gasto compartido
        is_shared: false,
        shared_user_code: '',
        shared_type: '50/50', // '50/50' o 'custom'
        owner_amount: '',
        shared_amount: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
    const [searchedUser, setSearchedUser] = useState<User | null>(null);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/expenses');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const searchUser = async () => {
        if (!data.shared_user_code || data.shared_user_code.length !== 8) {
            setSearchError('El código debe tener 8 caracteres');
            return;
        }

        try {
            const response = await axios.post('/user/search', {
                code: data.shared_user_code.toUpperCase()
            });

            if (response.data.success) {
                setSearchedUser(response.data.user);
                setSearchError('');
            }
        } catch (error: any) {
            setSearchError(error.response?.data?.message || 'Usuario no encontrado');
            setSearchedUser(null);
        }
    };

    const calculateSharedAmounts = () => {
        const totalAmount = parseFloat(data.amount);
        if (isNaN(totalAmount) || totalAmount <= 0) return;

        if (data.shared_type === '50/50') {
            const half = (totalAmount / 2).toFixed(2);
            setData({
                ...data,
                owner_amount: half,
                shared_amount: half,
            });
        }
    };

    useEffect(() => {
        if (data.is_shared && data.amount && data.shared_type === '50/50') {
            calculateSharedAmounts();
        }
    }, [data.amount, data.shared_type, data.is_shared]);

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const handleDateSelect = (date: Date) => {
        setData('expense_date', formatDate(date));
        setShowCalendar(false);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const categories = [
        'Alimentación',
        'Transporte',
        'Entretenimiento',
        'Salud',
        'Educación',
        'Ropa',
        'Hogar',
        'Servicios',
        'Otros'
    ];

    const paymentMethods = [
        'Efectivo',
        'Tarjeta de Débito',
        'Tarjeta de Crédito',
        'Transferencia',
        'PayPal',
        'Otro'
    ];

    return (
        <AdaptiveLayout>
            <Head title="Nuevo Gasto" />

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
                        <h1 className="text-xl font-bold text-gray-900">Nuevo Gasto</h1>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Amount - Full width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Monto *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-orange-600">
                                    {symbol}
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold bg-white text-orange-600"
                                    placeholder="0.00"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                            )}
                        </div>

                        {/* Description - Full width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Descripción *
                            </label>
                            <input
                                type="text"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-orange-600"
                                placeholder="¿En qué gastaste?"
                                required
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Category and Date - Side by side */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    Categoría
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-orange-600 bg-white text-sm font-medium"
                                >
                                    <option value="" className="text-orange-600">Categoría</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category} className="text-orange-600">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.category}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    Fecha *
                                </label>
                                <div className="relative" ref={calendarRef}>
                                    <input
                                        type="text"
                                        value={data.expense_date ? new Date(data.expense_date).toLocaleDateString('es-MX') : ''}
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        readOnly
                                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm cursor-pointer bg-white text-orange-600 font-medium"
                                        placeholder="Fecha"
                                        required
                                    />
                                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                    
                                    {showCalendar && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-3">
                                            {/* Header compacto */}
                                            <div className="flex items-center justify-between mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() => navigateMonth('prev')}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => navigateMonth('next')}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                            
                                            {/* Días de la semana - más compactos */}
                                            <div className="grid grid-cols-7 gap-0 mb-1">
                                                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
                                                    <div key={index} className="text-center text-xs font-medium text-gray-400 py-1">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Días del mes - estilo iPhone */}
                                            <div className="grid grid-cols-7 gap-0">
                                                {getDaysInMonth(currentMonth).map((day, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => day && handleDateSelect(day)}
                                                        disabled={!day}
                                                        className={`
                                                            w-8 h-8 text-xs rounded-full transition-all duration-200 flex items-center justify-center mx-auto
                                                            ${!day ? 'invisible' : ''}
                                                            ${day && formatDate(day) === data.expense_date 
                                                                ? 'bg-orange-500 text-white font-semibold shadow-sm' 
                                                                : 'hover:bg-gray-100 text-gray-700 active:bg-gray-200'
                                                            }
                                                            ${day && day.getDate() === new Date().getDate() && 
                                                              day.getMonth() === new Date().getMonth() && 
                                                              day.getFullYear() === new Date().getFullYear() &&
                                                              formatDate(day) !== data.expense_date
                                                                ? 'bg-gray-100 font-semibold' 
                                                                : ''
                                                            }
                                                        `}
                                                    >
                                                        {day?.getDate()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.expense_date && (
                                    <p className="mt-1 text-xs text-red-600">{errors.expense_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method and Notes - Side by side */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <CreditCard className="w-3 h-3 inline mr-1" />
                                    Método de Pago
                                </label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-orange-600 bg-white font-medium text-sm"
                                >
                                    <option value="" className="text-orange-600">Método</option>
                                    {paymentMethods.map((method) => (
                                        <option key={method} value={method} className="text-orange-600">
                                            {method}
                                        </option>
                                    ))}
                                </select>
                                {errors.payment_method && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.payment_method}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Notas
                                </label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-orange-600 text-sm"
                                    placeholder="Notas..."
                                />
                                {errors.notes && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.notes}</p>
                                )}
                            </div>
                        </div>

                        {/* Compartir Gasto */}
                        <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-orange-600" />
                                    <label className="text-xs font-semibold text-gray-900">
                                        Compartir Gasto
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('is_shared', !data.is_shared);
                                        if (data.is_shared) {
                                            setSearchedUser(null);
                                            setData({
                                                ...data,
                                                is_shared: false,
                                                shared_user_code: '',
                                                shared_type: '50/50',
                                                owner_amount: '',
                                                shared_amount: '',
                                            });
                                        }
                                    }}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        data.is_shared ? 'bg-orange-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                            data.is_shared ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                    />
                                </button>
                            </div>

                            {data.is_shared && (
                                <div className="space-y-2 mt-2">
                                    {/* Buscar Usuario */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Código de Usuario
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={data.shared_user_code}
                                                onChange={(e) => setData('shared_user_code', e.target.value.toUpperCase())}
                                                placeholder="Ej: ABC12345"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-orange-600 font-mono"
                                                maxLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={searchUser}
                                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm transition-colors"
                                            >
                                                Buscar
                                            </button>
                                        </div>
                                        {searchError && (
                                            <p className="mt-1 text-xs text-red-600">{searchError}</p>
                                        )}
                                        {searchedUser && (
                                            <div className="mt-2 p-2 bg-white rounded-lg border border-orange-200 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                                        <span className="text-orange-600 font-semibold text-sm">
                                                            {searchedUser.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{searchedUser.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{searchedUser.user_code}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchedUser(null);
                                                        setData('shared_user_code', '');
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tipo de División */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Tipo de División
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('shared_type', '50/50')}
                                                className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                    data.shared_type === '50/50'
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-gray-200 bg-white text-gray-600'
                                                }`}
                                            >
                                                50/50
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('shared_type', 'custom')}
                                                className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                    data.shared_type === 'custom'
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-gray-200 bg-white text-gray-600'
                                                }`}
                                            >
                                                Personalizado
                                            </button>
                                        </div>
                                    </div>

                                    {/* Montos */}
                                    {data.shared_type === 'custom' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Tú pagas
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-orange-600">
                                                        {symbol}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={data.owner_amount}
                                                        onChange={(e) => setData('owner_amount', e.target.value)}
                                                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-orange-600"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    {searchedUser?.name || 'Otro'} paga
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-orange-600">
                                                        {symbol}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={data.shared_amount}
                                                        onChange={(e) => setData('shared_amount', e.target.value)}
                                                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-orange-600"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        data.owner_amount && (
                                            <div className="bg-white rounded-lg p-3 border border-orange-200">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Tú pagas:</span>
                                                    <span className="font-bold text-orange-600">{symbol}{data.owner_amount}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm mt-1">
                                                    <span className="text-gray-600">{searchedUser?.name || 'Otro'} paga:</span>
                                                    <span className="font-bold text-orange-600">{symbol}{data.shared_amount}</span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Image Upload and Submit - Combined */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Camera className="w-3 h-3 inline mr-1" />
                                    Recibo/Foto
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs"
                                />
                                {errors.image && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.image}</p>
                                )}
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Desktop View - Placeholder */}
            <div className="hidden md:block p-8">
                <h1 className="text-2xl font-bold mb-4">Nuevo Gasto</h1>
                <p className="text-gray-600">Vista de escritorio en desarrollo...</p>
            </div>
        </AdaptiveLayout>
    );
}
