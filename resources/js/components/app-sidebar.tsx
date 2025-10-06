import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Receipt, PlusCircle, Users, Bell } from 'lucide-react';
import AppLogo from './app-logo';

const dashboardNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const expensesNavItems: NavItem[] = [
    {
        title: 'Transacciones',
        href: '/expenses',
        icon: Receipt,
    },
];

const actionsNavItems: NavItem[] = [
    {
        title: 'Nuevo Gasto',
        href: '/expenses/create',
        icon: PlusCircle,
    },
];

const usersNavItems: NavItem[] = [
    {
        title: 'Buscar Usuarios',
        href: '/users/search',
        icon: Users,
    },
];

const notificationsNavItems: NavItem[] = [
    {
        title: 'Notificaciones',
        href: '/notifications',
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={dashboardNavItems} title="Principal" />
                <NavMain items={expensesNavItems} title="Gastos" />
                <NavMain items={actionsNavItems} title="Acciones" />
                <NavMain items={usersNavItems} title="Usuarios" />
            </SidebarContent>

            <SidebarFooter>
                <NavMain items={notificationsNavItems} title="Notificaciones" />
                <NavFooter items={footerNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
