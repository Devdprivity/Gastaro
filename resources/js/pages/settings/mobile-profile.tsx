import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Camera, Trash2, AlertTriangle, Shield, CreditCard, Edit3, Coins } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdaptiveLayout from '@/layouts/adaptive-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function MobileProfile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <AdaptiveLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi Perfil" />

            {/* Mobile Version */}
            <div className="md:hidden h-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mi Perfil</h1>
                        <p className="text-gray-600 text-sm">Administra tu información personal</p>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Avatar and Name Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
                                <div className="text-center">
                                    {/* Avatar */}
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <div 
                                            onClick={handleAvatarClick}
                                            className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                                        >
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : auth?.user?.avatar ? (
                                                <img
                                                    src={auth.user.avatar}
                                                    alt={auth.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-orange-600 font-bold text-4xl">
                                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Camera Icon */}
                                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full border-2 border-orange-500 flex items-center justify-center shadow-lg">
                                            <Camera className="w-5 h-5 text-orange-600" />
                                        </div>
                                    </div>
                                    
                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    
                                    {/* Name with Edit Icon */}
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-xl font-bold text-white">
                                            {auth?.user?.name}
                                        </h2>
                                        <Edit3 className="w-4 h-4 text-white/80" />
                                    </div>
                                    
                                    {/* Status Badge */}
                                    <div className="flex justify-center gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                                            {auth?.user?.email_verified_at ? (
                                                <>
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Email Verificado
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Email Pendiente
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Currency Button */}
                            <div className="px-4 pb-4">
                                <Link
                                    href="/settings/currency"
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-300 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                            <Coins className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Configurar Moneda</p>
                                            <p className="text-sm text-gray-600">
                                                Actual: {auth?.user?.currency || 'CLP'} ({auth?.user?.locale || 'es_CL'})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-green-600">
                                        →
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Editar Información</h3>
                            </div>
                            
                            <div className="p-6">
                                <Form
                                    {...ProfileController.update.form()}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                    className="space-y-4"
                                >
                                    {({ processing, recentlySuccessful, errors }) => (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                                                <Input
                                                    id="name"
                                                    className="w-full bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                                    defaultValue={auth.user.name}
                                                    name="name"
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Ingresa tu nombre completo"
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <Button
                                                    disabled={processing}
                                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-colors"
                                                    data-test="update-profile-button"
                                                >
                                                    {processing ? (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Guardando...
                                                        </div>
                                                    ) : (
                                                        'Guardar Cambios'
                                                    )}
                                                </Button>
                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out"
                                                    enterFrom="opacity-0 scale-95"
                                                    enterTo="opacity-100 scale-100"
                                                    leave="transition ease-in-out"
                                                    leaveFrom="opacity-100 scale-100"
                                                    leaveTo="opacity-0 scale-95"
                                                >
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="text-sm text-green-700 font-medium">
                                                            ¡Guardado!
                                                        </p>
                                                    </div>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                                <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Zona de Peligro</h3>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {/* Warning Information */}
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-red-900 mb-2">Importante: Información sobre la eliminación de cuenta</h4>
                                            <div className="space-y-2 text-sm text-red-800">
                                                <p>• <strong>Tu cuenta será eliminada permanentemente</strong> y no podrás recuperarla</p>
                                                <p>• <strong>Los cargos procesados con Gastaro Pay seguirán en curso</strong> por respaldo a terceros</p>
                                                <p>• <strong>Todos los procesos en curso</strong> (transferencias, pagos pendientes) continuarán</p>
                                                <p>• <strong>Tus datos personales serán eliminados</strong> pero las transacciones financieras permanecerán</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => setShowDeleteWarning(!showDeleteWarning)}
                                    className="w-full flex items-center justify-center gap-3 p-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Eliminar Cuenta Permanentemente
                                </button>

                                {/* Confirmation Dialog */}
                                {showDeleteWarning && (
                                    <div className="mt-4 p-6 bg-red-50 border border-red-200 rounded-xl">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-red-900 mb-1">¿Estás completamente seguro?</h4>
                                                <p className="text-sm text-red-700 mb-3">
                                                    Esta acción es <strong>irreversible</strong>. Una vez eliminada tu cuenta, 
                                                    no podrás recuperar tus datos personales, aunque los procesos 
                                                    financieros con Gastaro Pay continuarán según los términos del servicio.
                                                </p>
                                                <div className="bg-red-100 p-3 rounded-lg mb-3">
                                                    <p className="text-xs text-red-800 font-medium">
                                                        ⚠️ Recuerda: Los cargos y procesos con Gastaro Pay seguirán activos por respaldo a terceros
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowDeleteWarning(false)}
                                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Aquí iría la lógica para eliminar la cuenta
                                                    console.log('Eliminar cuenta confirmado');
                                                }}
                                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Sí, Eliminar Cuenta
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Gastaro Pay Information */}
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">Gastaro Pay</h4>
                                            <p className="text-sm text-blue-800">
                                                Si tienes procesos activos con Gastaro Pay, estos continuarán 
                                                funcionando independientemente del estado de tu cuenta principal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Version - Redirect to original */}
            <div className="hidden md:block">
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Vista de Escritorio</h1>
                    <p className="text-gray-600 mb-4">Esta es la versión móvil optimizada del perfil.</p>
                    <Link 
                        href="/settings/profile" 
                        className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Ver Versión Completa
                    </Link>
                </div>
            </div>
        </AdaptiveLayout>
    );
}
