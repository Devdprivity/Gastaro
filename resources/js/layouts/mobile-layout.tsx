import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { type ReactNode, useState, useEffect } from 'react';
import axios from 'axios';

interface MobileLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MobileLayout({ children, breadcrumbs }: MobileLayoutProps) {
    const { auth } = usePage().props as any;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get('/notifications/unread-count');
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error('Error al obtener contador de notificaciones:', error);
            }
        };

        fetchUnreadCount();

        // Actualizar cada 30 segundos
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden md:min-h-screen md:h-auto">
            {/* Mobile Header */}
            <header className="flex-none z-40 bg-transparent md:hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    {/* User Profile - Left */}
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2"
                    >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 flex items-center justify-center shadow-sm">
                            {auth?.user?.avatar ? (
                                <img
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-orange-600 font-semibold text-sm">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {auth?.user?.name}
                        </span>
                    </button>

                    {/* Notifications - Right */}
                    <Link
                        href="/notifications"
                        className="relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute left-4 top-16 z-50 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-900">{auth?.user?.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{auth?.user?.email}</p>
                                </div>
                                <a
                                    href="/logout"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const form = document.createElement('form');
                                        form.method = 'POST';
                                        form.action = '/logout';
                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                        if (token) {
                                            const input = document.createElement('input');
                                            input.type = 'hidden';
                                            input.name = '_token';
                                            input.value = token;
                                            form.appendChild(input);
                                        }
                                        document.body.appendChild(form);
                                        form.submit();
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar sesión
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content - sin scroll propio */}
            <main className="flex-1 overflow-hidden md:overflow-auto md:pb-0">
                {children}
            </main>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
}
