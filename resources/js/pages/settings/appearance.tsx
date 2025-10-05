import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AdaptiveLayout from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AdaptiveLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            {/* Mobile Version */}
            <div className="md:hidden">
                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900 mb-1">Apariencia</h1>
                        <p className="text-sm text-gray-600">Personaliza la apariencia de tu cuenta</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <AppearanceTabs />
                    </div>
                </div>
            </div>

            {/* Desktop Version */}
            <div className="hidden md:block">
                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall
                            title="Appearance settings"
                            description="Update your account's appearance settings"
                        />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </div>
        </AdaptiveLayout>
    );
}
