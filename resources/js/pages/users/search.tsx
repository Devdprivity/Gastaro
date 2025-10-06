import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Search, Copy, Users, UserPlus, CheckCircle, AlertCircle, ChevronLeft, DollarSign, FileText, Tag, Calendar, Camera, X } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useCurrency } from '@/lib/currency';

interface User {
    id: number;
    name: string;
    user_code: string;
    avatar: string | null;
}

interface SharedExpense {
    id: number;
    user: { name: string; avatar: string | null };
    expense: { description: string; amount: number; fullDescription: string };
    date: string;
}

interface SearchUsersProps {
    auth: {
        user: User;
    };
    sharedExpenses: SharedExpense[];
}

export default function SearchUsers({ auth, sharedExpenses }: SearchUsersProps) {
    const [searchCode, setSearchCode] = useState('');
    const [searchResult, setSearchResult] = useState<User | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<SharedExpense | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { format, symbol } = useCurrency(auth);

    const { data, setData, post, processing, errors, reset } = useForm({
        shared_with_id: 0,
        amount: '',
        description: '',
        category: '',
        expense_date: new Date().toISOString().split('T')[0],
        split_type: '50/50',
        owner_amount: '',
        shared_amount: '',
        notes: '',
        image: null as File | null,
    });

    const handleSearch = async () => {
        if (!searchCode.trim()) return;

        setIsSearching(true);
        setError('');

        try {
            const response = await axios.post('/user/search', {
                code: searchCode.toUpperCase()
            });

            if (response.data.success) {
                setSearchResult(response.data.user);
            } else {
                setError(response.data.message || 'Usuario no encontrado');
                setSearchResult(null);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error al buscar usuario');
            setSearchResult(null);
        } finally {
            setIsSearching(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            console.error('Error al copiar');
        }
    };

    const handleAddUser = () => {
        if (searchResult) {
            setData('shared_with_id', searchResult.id);
            setShowShareModal(true);
        }
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

    const handleSplitTypeChange = (type: string) => {
        setData('split_type', type);
        if (type === '50/50' && data.amount) {
            const amount = parseFloat(data.amount);
            const half = (amount / 2).toFixed(2);
            setData('owner_amount', half);
            setData('shared_amount', half);
        }
    };

    const handleAmountChange = (value: string) => {
        setData('amount', value);
        if (data.split_type === '50/50' && value) {
            const amount = parseFloat(value);
            const half = (amount / 2).toFixed(2);
            setData('owner_amount', half);
            setData('shared_amount', half);
        }
    };

    const handleSubmitSharedExpense = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shared-expenses/create', {
            onSuccess: () => {
                setShowShareModal(false);
                setAddSuccess(true);
                setTimeout(() => setAddSuccess(false), 3000);
                reset();
                setImagePreview(null);
            }
        });
    };

    const handleCloseModal = () => {
        setShowShareModal(false);
        reset();
        setImagePreview(null);
    };

    const categories = [
        'Comida',
        'Transporte',
        'Entretenimiento',
        'Servicios',
        'Compras',
        'Salud',
        'Educación',
        'Otros'
    ];

    const handleExpenseClick = (expense: SharedExpense) => {
        setSelectedExpense(expense);
    };

    const handleBackToCarousel = () => {
        setSelectedExpense(null);
    };

    const truncateText = (text: string, maxLength: number = 450) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AdaptiveLayout>
            <Head title="Buscar Usuarios" />

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
                        <h1 className="text-lg font-bold text-gray-900">Buscar Usuarios</h1>
                    </div>
                </div>

                {/* Content - Sin scroll */}
                <div className="flex-1 overflow-hidden px-3 py-3 pb-20">
                    <div className="h-full flex flex-col space-y-3">
                        {/* Perfil del usuario actual */}
                        <div className="flex-none bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
                            <div className="text-center">
                                {/* Avatar grande */}
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2 border-orange-500 bg-white flex items-center justify-center shadow-md">
                                    {auth.user.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-orange-600 font-bold text-lg">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Nombre */}
                                <h2 className="text-base font-bold text-gray-900 mb-1">{auth.user.name}</h2>

                                {/* Título del código */}
                                <p className="text-[10px] text-gray-600 mb-1.5">Tu código de usuario</p>

                                {/* Código para copiar - Mejorado */}
                                <div className="flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                                    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                        <input
                                            value={auth.user.user_code}
                                            readOnly
                                            className="w-full py-1.5 px-2 text-center font-mono text-sm font-bold text-orange-600 bg-transparent focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(auth.user.user_code)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                            copySuccess
                                                ? 'bg-green-500 text-white'
                                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                        }`}
                                    >
                                        {copySuccess ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>

                                {/* Feedback de copia */}
                                {copySuccess && (
                                    <p className="text-green-600 text-[10px] font-medium mt-1 flex items-center justify-center gap-1">
                                        <CheckCircle className="w-2.5 h-2.5" />
                                        ¡Código copiado!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Búsqueda de usuarios */}
                        <div className="flex-none bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Search className="w-3.5 h-3.5 text-orange-500" />
                                <h3 className="text-sm font-semibold text-gray-900">Buscar Usuario</h3>
                            </div>

                            <div className="space-y-2">
                                <div className="flex gap-1.5">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchCode}
                                            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                                            placeholder="Código (8 caracteres)"
                                            className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-xs placeholder-gray-400 text-orange-600"
                                            maxLength={8}
                                        />
                                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching || !searchCode.trim()}
                                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-1 text-xs"
                                    >
                                        {isSearching ? (
                                            <>
                                                <svg className="animate-spin h-2.5 w-2.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                ...
                                            </>
                                        ) : (
                                            'Buscar'
                                        )}
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-1.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-1.5">
                                        <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                                        <p className="text-red-600 text-[10px]">{error}</p>
                                    </div>
                                )}

                                {searchResult && (
                                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-green-500 bg-green-100 flex items-center justify-center flex-shrink-0">
                                                {searchResult.avatar ? (
                                                    <img
                                                        src={searchResult.avatar}
                                                        alt={searchResult.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-green-600 font-semibold text-[10px]">
                                                        {searchResult.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate text-xs">{searchResult.name}</h4>
                                                <p className="text-[10px] text-gray-600 font-mono">{searchResult.user_code}</p>
                                            </div>
                                            <button
                                                onClick={handleAddUser}
                                                className={`px-2 py-1 text-white text-[10px] font-medium rounded-md transition-colors flex items-center gap-0.5 ${
                                                    addSuccess
                                                        ? 'bg-green-500'
                                                        : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                            >
                                                {addSuccess ? (
                                                    <>
                                                        <CheckCircle className="w-2.5 h-2.5" />
                                                        ¡Agregado!
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="w-2.5 h-2.5" />
                                                        Agregar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Carousel de gastos compartidos */}
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-200 overflow-hidden">
                            {!selectedExpense ? (
                                <>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="w-4 h-4 text-orange-500" />
                                        <h3 className="text-base font-semibold text-gray-900">Gastos Compartidos</h3>
                                    </div>
                                    
                                    {/* Carousel horizontal de gastos compartidos */}
                                    <div className="h-full overflow-x-auto pb-2">
                                        {sharedExpenses.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-center">
                                                <div className="text-gray-400">
                                                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No hay gastos compartidos</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3 min-w-max h-full">
                                                {sharedExpenses.map((expense) => (
                                                <div 
                                                    key={expense.id} 
                                                    onClick={() => handleExpenseClick(expense)}
                                                    className="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors border border-orange-200 cursor-pointer h-full flex flex-col"
                                                >
                                                    {/* Avatar del usuario */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 flex items-center justify-center">
                                                            {expense.user.avatar ? (
                                                                <img
                                                                    src={expense.user.avatar}
                                                                    alt={expense.user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-orange-600 font-semibold text-xs">
                                                                    {expense.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-medium text-gray-900 truncate text-xs">
                                                                {expense.user.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(expense.date).toLocaleDateString('es-MX', { 
                                                                    day: 'numeric', 
                                                                    month: 'short' 
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Información del gasto */}
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div className="space-y-2">
                                                            <p className="text-xs text-gray-600 truncate">
                                                                {expense.expense.description}
                                                            </p>
                                                            <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2 max-h-20 overflow-hidden">
                                                                <p className="leading-relaxed">
                                                                    {truncateText(expense.expense.fullDescription)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right mt-auto">
                                                            <p className="font-bold text-gray-900 text-base">
                                                                {format(expense.expense.amount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Detalle del gasto compartido */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <button 
                                            onClick={handleBackToCarousel}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <h3 className="text-base font-semibold text-gray-900">Detalle del Gasto</h3>
                                    </div>
                                    
                                    <div className="h-full flex flex-col space-y-4">
                                        {/* Información del usuario */}
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-4 border-orange-500 bg-orange-100 flex items-center justify-center">
                                                {selectedExpense.user.avatar ? (
                                                    <img
                                                        src={selectedExpense.user.avatar}
                                                        alt={selectedExpense.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-orange-600 font-bold text-xl">
                                                        {selectedExpense.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{selectedExpense.user.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(selectedExpense.date).toLocaleDateString('es-MX', { 
                                                    weekday: 'long',
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                        
                                        {/* Detalles del gasto */}
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Descripción:</span>
                                                <span className="font-medium text-gray-900 text-sm">{selectedExpense.expense.description}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Monto:</span>
                                                <span className="font-bold text-xl text-gray-900">{format(selectedExpense.expense.amount)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Estado:</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    Compartido
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Acciones */}
                                        <div className="space-y-2">
                                            <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm">
                                                Ver Recibo
                                            </button>
                                            <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm">
                                                Comentar
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex h-screen flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Buscar Usuarios</h1>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        {/* Perfil del usuario actual */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                            <div className="text-center">
                                {/* Avatar grande */}
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500 bg-white flex items-center justify-center shadow-lg">
                                    {auth.user.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-orange-600 font-bold text-3xl">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Nombre */}
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{auth.user.name}</h2>

                                {/* Título del código */}
                                <p className="text-sm text-gray-600 mb-3">Tu código de usuario</p>

                                {/* Código para copiar */}
                                <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
                                    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        <input
                                            value={auth.user.user_code}
                                            readOnly
                                            className="w-full py-3 px-4 text-center font-mono text-lg font-bold text-orange-600 bg-transparent focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(auth.user.user_code)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                            copySuccess
                                                ? 'bg-green-500 text-white'
                                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                        }`}
                                    >
                                        {copySuccess ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Feedback de copia */}
                                {copySuccess && (
                                    <p className="text-green-600 text-sm font-medium mt-3 flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        ¡Código copiado!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Búsqueda de usuarios */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Search className="w-5 h-5 text-orange-500" />
                                <h3 className="text-lg font-semibold text-gray-900">Buscar Usuario</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchCode}
                                            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                                            placeholder="Código de usuario (8 caracteres)"
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-base placeholder-gray-400 text-orange-600"
                                            maxLength={8}
                                        />
                                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching || !searchCode.trim()}
                                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSearching ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Buscando...
                                            </>
                                        ) : (
                                            'Buscar'
                                        )}
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                )}

                                {searchResult && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-green-500 bg-green-100 flex items-center justify-center flex-shrink-0">
                                                {searchResult.avatar ? (
                                                    <img
                                                        src={searchResult.avatar}
                                                        alt={searchResult.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-green-600 font-semibold text-lg">
                                                        {searchResult.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate text-base">{searchResult.name}</h4>
                                                <p className="text-sm text-gray-600 font-mono">{searchResult.user_code}</p>
                                            </div>
                                            <button
                                                onClick={handleAddUser}
                                                className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                                                    addSuccess
                                                        ? 'bg-green-500'
                                                        : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                            >
                                                {addSuccess ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        ¡Agregado!
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="w-4 h-4" />
                                                        Compartir Gasto
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Gastos Compartidos */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        {!selectedExpense ? (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <Users className="w-6 h-6 text-orange-500" />
                                    <h3 className="text-xl font-semibold text-gray-900">Gastos Compartidos</h3>
                                </div>

                                {/* Grid de gastos compartidos */}
                                <div className="flex-1 overflow-y-auto">
                                    {sharedExpenses.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-center">
                                            <div className="text-gray-400">
                                                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                <p className="text-lg">No hay gastos compartidos</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            {sharedExpenses.map((expense) => (
                                                <div
                                                    key={expense.id}
                                                    onClick={() => handleExpenseClick(expense)}
                                                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-orange-200 cursor-pointer flex flex-col"
                                                >
                                                    {/* Avatar del usuario */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 flex items-center justify-center">
                                                            {expense.user.avatar ? (
                                                                <img
                                                                    src={expense.user.avatar}
                                                                    alt={expense.user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-orange-600 font-semibold text-sm">
                                                                    {expense.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-medium text-gray-900 truncate text-sm">
                                                                {expense.user.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(expense.date).toLocaleDateString('es-MX', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Información del gasto */}
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                            {expense.expense.description}
                                                        </p>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900 text-lg">
                                                                {format(expense.expense.amount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Detalle del gasto compartido */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={handleBackToCarousel}
                                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <h3 className="text-xl font-semibold text-gray-900">Detalle del Gasto</h3>
                                </div>

                                <div className="flex-1 flex flex-col space-y-6 overflow-y-auto">
                                    {/* Información del usuario */}
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500 bg-orange-100 flex items-center justify-center">
                                            {selectedExpense.user.avatar ? (
                                                <img
                                                    src={selectedExpense.user.avatar}
                                                    alt={selectedExpense.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-orange-600 font-bold text-3xl">
                                                    {selectedExpense.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedExpense.user.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {new Date(selectedExpense.date).toLocaleDateString('es-MX', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {/* Detalles del gasto */}
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Descripción:</span>
                                            <span className="font-semibold text-gray-900">{selectedExpense.expense.description}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Monto:</span>
                                            <span className="font-bold text-2xl text-gray-900">{format(selectedExpense.expense.amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Estado:</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                Compartido
                                            </span>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="space-y-3">
                                        <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors">
                                            Ver Recibo
                                        </button>
                                        <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                                            Comentar
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para compartir gasto */}
            {showShareModal && searchResult && (
                <div
                    className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
                    style={{
                        animation: 'slideDown 0.3s ease-out',
                    }}
                >
                    <style>{`
                        @keyframes slideDown {
                            from {
                                transform: translateY(-100%);
                                opacity: 0;
                            }
                            to {
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }
                    `}</style>
                    <div className="bg-white rounded-b-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-b-2 border-gray-200">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 flex items-center justify-center">
                                    {searchResult.avatar ? (
                                        <img
                                            src={searchResult.avatar}
                                            alt={searchResult.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-orange-600 font-bold text-sm">
                                            {searchResult.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{searchResult.name}</p>
                                    <p className="text-xs text-gray-500">Compartir gasto</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                            >
                                <X className="w-4 h-4 text-gray-700" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmitSharedExpense} className="p-4 space-y-3">
                            {/* Monto y Descripción */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Monto *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base font-semibold text-orange-600">
                                        {symbol}
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.amount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-semibold bg-white text-orange-600"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Descripción *</label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-orange-600"
                                    placeholder="¿En qué se gastó?"
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Tipo de División */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">División</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSplitTypeChange('50/50')}
                                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                                            data.split_type === '50/50'
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        50/50
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSplitTypeChange('custom')}
                                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                                            data.split_type === 'custom'
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        Personalizado
                                    </button>
                                </div>
                            </div>

                            {/* División de montos */}
                            {data.split_type === 'custom' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tú pagas</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-orange-600">
                                                {symbol}
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.owner_amount}
                                                onChange={(e) => setData('owner_amount', e.target.value)}
                                                className="w-full pl-8 pr-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold bg-white text-orange-600"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">{searchResult.name.split(' ')[0]} paga</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-orange-600">
                                                {symbol}
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.shared_amount}
                                                onChange={(e) => setData('shared_amount', e.target.value)}
                                                className="w-full pl-8 pr-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold bg-white text-orange-600"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 50/50 Preview */}
                            {data.split_type === '50/50' && data.amount && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-700">Tú: {format(parseFloat(data.amount) / 2)}</span>
                                        <span className="text-gray-700">{searchResult.name.split(' ')[0]}: {format(parseFloat(data.amount) / 2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Categoría y Fecha */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-orange-600 bg-white text-xs font-medium"
                                    >
                                        <option value="">Seleccionar</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        value={data.expense_date}
                                        onChange={(e) => setData('expense_date', e.target.value)}
                                        className="w-full px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs bg-white text-orange-600 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Foto */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Camera className="w-3 h-3 inline mr-1" />
                                    Foto (Opcional)
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-500 transition-colors">
                                            <Camera className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs text-gray-600">
                                                {imagePreview ? 'Cambiar' : 'Subir'}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {imagePreview && (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-orange-500">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm"
                                >
                                    {processing ? 'Enviando...' : 'Compartir'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdaptiveLayout>
    );
}
