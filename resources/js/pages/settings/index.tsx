import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    ChevronRight, 
    User, 
    Shield, 
    Bell, 
    CreditCard, 
    HelpCircle, 
    LogOut, 
    Trash2,
    Settings as SettingsIcon,
    Smartphone,
    Globe,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsIndex() {
    const { auth } = usePage().props as any;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleLogout = () => {
        // Implementar logout
        console.log('Logout clicked');
    };

    const handleDeleteAccount = () => {
        // Implementar eliminación de cuenta
        console.log('Delete account clicked');
    };

    return (
        <AdaptiveLayout>
            <Head title="Configuración" />

            {/* Mobile View */}
            <div className="md:hidden h-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Configuración</h1>
                        <p className="text-gray-600 text-sm">Administra tu cuenta y preferencias</p>
                    </div>
                    
                    <div className="space-y-6">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white bg-white flex items-center justify-center shadow-lg">
                                        {auth?.user?.avatar ? (
                                            <img
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-orange-600 font-bold text-xl">
                                                {auth?.user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-white truncate">
                                            {auth?.user?.name}
                                        </h2>
                                        <p className="text-orange-100 text-sm truncate">{auth?.user?.email}</p>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                                Usuario Verificado
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cuenta</h3>
                            </div>
                            
                            <div className="divide-y divide-gray-200">
                                <Link
                                    href="/settings/mobile-profile"
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                            <User className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Perfil</p>
                                            <p className="text-sm text-gray-500">
                                                Información personal y avatar
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>

                                <Link
                                    href="/settings/password"
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <Lock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Seguridad</p>
                                            <p className="text-sm text-gray-500">
                                                Contraseña y autenticación
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>
                            </div>
                        </div>

                        {/* App Settings */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Aplicación</h3>
                            </div>
                            
                            <div className="divide-y divide-gray-200">
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                            <Bell className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Notificaciones</p>
                                            <p className="text-sm text-gray-500">
                                                Alertas y recordatorios
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Activadas</span>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <Eye className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Privacidad</p>
                                            <p className="text-sm text-gray-500">
                                                Control de datos personales
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>

                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                            <Globe className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Idioma</p>
                                            <p className="text-sm text-gray-500">
                                                Español (México)
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Soporte</h3>
                            </div>
                            
                            <div className="divide-y divide-gray-200">
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                            <HelpCircle className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Ayuda</p>
                                            <p className="text-sm text-gray-500">
                                                Centro de ayuda y FAQ
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>

                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                                            <Smartphone className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Contacto</p>
                                            <p className="text-sm text-gray-500">
                                                Soporte técnico
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                                <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Zona de Peligro</h3>
                            </div>
                            
                            <div className="p-4 space-y-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Cerrar Sesión
                                </button>

                                <button
                                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Eliminar Cuenta
                                </button>

                                {showDeleteConfirm && (
                                    <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm text-red-700 mb-3">
                                            Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View - Placeholder */}
            <div className="hidden md:block p-8">
                <h1 className="text-2xl font-bold mb-4">Configuración</h1>
                <p className="text-gray-600">Vista de escritorio en desarrollo...</p>
            </div>
        </AdaptiveLayout>
    );
}
