import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect, useState } from 'react';
import AppLayout from './app-layout';
import MobileLayout from './mobile-layout';

interface AdaptiveLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdaptiveLayout({ children, breadcrumbs }: AdaptiveLayoutProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return <MobileLayout breadcrumbs={breadcrumbs}>{children}</MobileLayout>;
    }

    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}
