import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { Home, Settings, Plus, AtSign, CreditCard } from 'lucide-react';

export function MobileBottomNav() {
    const { url } = usePage();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
            {/* Contenedor con padding para el efecto flotante */}
            <div className="px-4 pb-4">
                {/* Barra de navegación flotante con bordes redondeados */}
                <div className="bg-white rounded-[25px] shadow-lg border border-gray-200 pointer-events-auto">
                    <div className="flex items-center justify-between h-16 px-6 relative">
                        {/* Lado izquierdo - Inicio y Buscar */}
                        <div className="flex items-center gap-10">
                            {/* Inicio */}
                            <Link
                                href={dashboard().url}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 transition-colors duration-200',
                                    url === dashboard().url || url.startsWith(dashboard().url.split('?')[0])
                                        ? 'text-orange-600'
                                        : 'text-gray-600 hover:text-orange-500'
                                )}
                            >
                                <Home className={cn('w-6 h-6', (url === dashboard().url || url.startsWith(dashboard().url.split('?')[0])) && 'stroke-[2.5]')} />
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    (url === dashboard().url || url.startsWith(dashboard().url.split('?')[0])) && 'font-semibold'
                                )}>
                                    Inicio
                                </span>
                            </Link>

                            {/* Buscar */}
                            <Link
                                href="/users/search"
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 transition-colors duration-200',
                                    url === '/users/search' || url.startsWith('/users/search')
                                        ? 'text-orange-600'
                                        : 'text-gray-600 hover:text-orange-500'
                                )}
                            >
                                <AtSign className={cn('w-6 h-6', (url === '/users/search' || url.startsWith('/users/search')) && 'stroke-[2.5]')} />
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    (url === '/users/search' || url.startsWith('/users/search')) && 'font-semibold'
                                )}>
                                    Buscar
                                </span>
                            </Link>
                        </div>

                        {/* Botón central especial (Ingresos) */}
                        <Link
                            href="/incomes"
                            className="absolute left-1/2 -translate-x-1/2 -top-6 flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full shadow-xl hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-8 h-8 text-white stroke-[2.5]" />
                        </Link>

                        {/* Lado derecho - Ajustes y Gastaro Pay */}
                        <div className="flex items-center gap-10">
                         
                            {/* Gastaro Pay */}
                            <Link
                                href="/gastaro-pay"
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 transition-colors duration-200',
                                    url === '/gastaro-pay' || url.startsWith('/gastaro-pay')
                                        ? 'text-orange-600'
                                        : 'text-gray-600 hover:text-orange-500'
                                )}
                            >
                                <CreditCard className={cn('w-6 h-6', (url === '/gastaro-pay' || url.startsWith('/gastaro-pay')) && 'stroke-[2.5]')} />
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    (url === '/gastaro-pay' || url.startsWith('/gastaro-pay')) && 'font-semibold'
                                )}>
                                    Pay
                                </span>
                            </Link>
                               {/* Ajustes */}
                               <Link
                                href="/settings"
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 transition-colors duration-200',
                                    url === '/settings' || url.startsWith('/settings')
                                        ? 'text-orange-600'
                                        : 'text-gray-600 hover:text-orange-500'
                                )}
                            >
                                <Settings className={cn('w-6 h-6', (url === '/settings' || url.startsWith('/settings')) && 'stroke-[2.5]')} />
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    (url === '/settings' || url.startsWith('/settings')) && 'font-semibold'
                                )}>
                                    Ajustes
                                </span>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
