import { Head, usePage } from '@inertiajs/react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { errors } = usePage().props as any;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center p-4 sm:p-6">
            <Head title="Iniciar Sesión" />

            <div className="w-full max-w-md">
                {/* Logo & Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl shadow-2xl mb-4 transform hover:scale-105 transition-transform duration-300">
                        <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-600">
                            G
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                        Gastaro
                    </h1>
                    <p className="text-orange-50 text-base sm:text-lg font-medium">
                        Sistema de Gestión
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        {/* Status Messages */}
                        {status && (
                            <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                                <p className="text-sm text-orange-800 font-medium">{status}</p>
                            </div>
                        )}

                        {errors.error && (
                            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                                <p className="text-sm text-red-800 font-medium">{errors.error}</p>
                            </div>
                        )}

                        {/* Welcome Text */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                ¡Bienvenido! 👋
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Inicia sesión para continuar
                            </p>
                        </div>

                        {/* Google Sign In Button */}
                        <a
                            href="/auth/google"
                            className="group relative flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-200 hover:border-orange-500 text-gray-700 font-semibold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] overflow-hidden"
                        >
                            {/* Hover background effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Google Icon */}
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                            </svg>

                            <span className="text-base sm:text-lg relative z-10">Continuar con Google</span>
                        </a>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-xs sm:text-sm font-medium">
                                Conexión segura y encriptada
                            </p>
                        </div>

                        {/* Terms */}
                        <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
                            Al continuar, aceptas nuestros{' '}
                            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                                términos de servicio
                            </a>
                            {' '}y{' '}
                            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                                política de privacidad
                            </a>
                        </p>
                    </div>
                </div>

                {/* Help Link */}
                <div className="mt-6 text-center">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-white hover:text-orange-100 text-sm font-medium transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ¿Necesitas ayuda?
                    </a>
                </div>
            </div>
        </div>
    );
}
