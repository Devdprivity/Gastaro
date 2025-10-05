import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Smartphone } from 'lucide-react';

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface WelcomeProps {
    auth: {
        user: User;
    };
}

export default function Welcome({ auth }: WelcomeProps) {
    return (
        <>
            <Head title="Bienvenido" />

            {/* Mobile View */}
            <div className="md:hidden min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                        {/* Success Icon */}
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="mb-6">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-orange-500 bg-orange-100 flex items-center justify-center shadow-lg">
                                {auth.user.avatar ? (
                                    <img
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-orange-600 font-bold text-5xl">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* User Name */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            ¡Hola, {auth.user.name}!
                        </h1>

                        {/* Success Message */}
                        <div className="mb-8">
                            <p className="text-lg text-gray-700 mb-2 font-medium">
                                Tu cuenta fue creada exitosamente
                            </p>
                            <p className="text-sm text-gray-500">
                                Estás listo para comenzar a gestionar tus gastos
                            </p>
                        </div>

                        {/* Continue Button */}
                        <Link
                            href="/dashboard"
                            className="block w-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Continuar al Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop View - Warning Message */}
            <div className="hidden md:flex min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 items-center justify-center p-8">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                        {/* Avatar */}
                        <div className="mb-8">
                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-orange-500 bg-orange-100 flex items-center justify-center shadow-lg">
                                {auth.user.avatar ? (
                                    <img
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-orange-600 font-bold text-6xl">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* User Name */}
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">
                            ¡Hola, {auth.user.name}!
                        </h1>

                        {/* Success Message */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center gap-3 mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                                <p className="text-2xl text-gray-700 font-medium">
                                    Tu cuenta fue creada exitosamente
                                </p>
                            </div>
                        </div>

                        {/* Mobile Only Message */}
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 mb-6">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Smartphone className="w-12 h-12 text-orange-600" />
                            </div>
                            <p className="text-xl text-gray-700 font-medium mb-2">
                                Versión de escritorio en desarrollo
                            </p>
                            <p className="text-gray-600">
                                Por favor, abre Gastaro desde un dispositivo móvil para disfrutar de la mejor experiencia.
                            </p>
                        </div>

                        {/* Info Text */}
                        <p className="text-sm text-gray-500">
                            Estamos trabajando en la versión de escritorio. Mientras tanto, puedes acceder desde tu teléfono móvil o tablet.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
