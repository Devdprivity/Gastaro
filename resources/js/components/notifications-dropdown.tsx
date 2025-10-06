import { Bell, Check, CheckCheck, Trash2, DollarSign, TrendingUp, Users, User, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data: any;
    read: boolean;
    read_at: string | null;
    created_at: string;
}

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();

        // Fetch notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await axios.post(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.post('/notifications/read-all');
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            const deletedNotification = notifications.find(n => n.id === id);
            if (deletedNotification && !deletedNotification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    };

    const handleAccept = async (sharedExpenseId: number) => {
        try {
            await axios.post(`/shared-expenses/${sharedExpenseId}/accept`);
            router.reload();
        } catch (error) {
            console.error('Error al aceptar gasto compartido:', error);
        }
    };

    const handleReject = async (sharedExpenseId: number) => {
        try {
            await axios.post(`/shared-expenses/${sharedExpenseId}/reject`);
            router.reload();
        } catch (error) {
            console.error('Error al rechazar gasto compartido:', error);
        }
    };

    const getIcon = (type: string, data: any) => {
        switch (type) {
            case 'expense':
                return <DollarSign className="w-4 h-4 text-red-600" />;
            case 'income':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'gastaro_pay':
                return <CreditCard className="w-4 h-4 text-blue-600" />;
            case 'shared_expense':
                return <Users className="w-4 h-4 text-purple-600" />;
            case 'shared_expense_response':
                return data?.status === 'accepted'
                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                    : <XCircle className="w-4 h-4 text-red-600" />;
            case 'profile_update':
                return <User className="w-4 h-4 text-orange-600" />;
            default:
                return <Bell className="w-4 h-4 text-gray-600" />;
        }
    };

    const getBackgroundColor = (type: string, data: any) => {
        switch (type) {
            case 'expense': return 'bg-red-100';
            case 'income': return 'bg-green-100';
            case 'gastaro_pay': return 'bg-blue-100';
            case 'shared_expense': return 'bg-purple-100';
            case 'shared_expense_response':
                return data?.status === 'accepted' ? 'bg-green-100' : 'bg-red-100';
            case 'profile_update': return 'bg-orange-100';
            default: return 'bg-gray-100';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `Hace ${minutes} min`;
        } else if (hours < 24) {
            return `Hace ${hours}h`;
        } else if (days < 7) {
            return `Hace ${days}d`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
            });
        }
    };

    const handleViewAll = () => {
        setIsOpen(false);
        router.visit('/notifications');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                            >
                                <CheckCheck className="w-3 h-3" />
                                Marcar todas
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center">
                                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">No hay notificaciones</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                        !notification.read ? 'bg-orange-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full ${getBackgroundColor(notification.type, notification.data)} flex items-center justify-center flex-shrink-0`}>
                                            {getIcon(notification.type, notification.data)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(notification.created_at)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                {notification.type === 'shared_expense' && notification.data?.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAccept(notification.data.shared_expense_id)}
                                                            className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                                        >
                                                            <CheckCircle className="w-3 h-3" />
                                                            Aceptar
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(notification.data.shared_expense_id)}
                                                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                                        >
                                                            <XCircle className="w-3 h-3" />
                                                            Rechazar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Leída
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <button
                                onClick={handleViewAll}
                                className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
