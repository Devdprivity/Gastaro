import AdaptiveLayout from '@/layouts/adaptive-layout';
import { Head, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Trash2, DollarSign, TrendingUp, Users, User, CreditCard } from 'lucide-react';
import { useState } from 'react';
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

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
    onDelete: (id: number) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case 'expense':
                return <DollarSign className="w-5 h-5 text-red-600" />;
            case 'income':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'gastaro_pay':
                return <CreditCard className="w-5 h-5 text-blue-600" />;
            case 'shared_expense':
                return <Users className="w-5 h-5 text-purple-600" />;
            case 'profile_update':
                return <User className="w-5 h-5 text-orange-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'expense':
                return 'bg-red-100';
            case 'income':
                return 'bg-green-100';
            case 'gastaro_pay':
                return 'bg-blue-100';
            case 'shared_expense':
                return 'bg-purple-100';
            case 'profile_update':
                return 'bg-orange-100';
            default:
                return 'bg-gray-100';
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

    return (
        <div className={`p-4 border-b border-gray-200 ${!notification.read ? 'bg-orange-50' : 'bg-white'}`}>
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${getBackgroundColor()} flex items-center justify-center flex-shrink-0`}>
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                {formatDate(notification.created_at)}
                            </p>
                        </div>
                        {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        {!notification.read && (
                            <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                Marcar como leída
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NotificationsIndex({ notifications: initialNotifications, unreadCount: initialUnreadCount }: any) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications.data || []);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);

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

    return (
        <AdaptiveLayout>
            <Head title="Notificaciones" />

            {/* Mobile View */}
            <div className="md:hidden h-full flex flex-col overflow-hidden bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Notificaciones</h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {unreadCount} sin leer
                                </p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Marcar todas
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto pb-24">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Bell className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                No tienes notificaciones
                            </h2>
                            <p className="text-sm text-gray-600 text-center max-w-xs">
                                Cuando tengas nuevas notificaciones, aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block p-8">
                <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
                <p className="text-gray-600">Vista de escritorio en desarrollo...</p>
            </div>
        </AdaptiveLayout>
    );
}
