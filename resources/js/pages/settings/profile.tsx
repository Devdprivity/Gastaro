import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdaptiveLayout from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(ProfileController.update().url, {
            preserveScroll: true,
        });
    };

    return (
        <AdaptiveLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            {/* Mobile Version */}
            <div className="md:hidden h-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                    {/* Page Title */}
                    <div className="mb-6">
                        {/* <h1 className="text-2xl font-bold text-gray-900 mb-1">Mi Perfil</h1>
                        <p className="text-gray-600 text-sm">Administra tu información personal</p> */}
                    </div>
                    
                    <div className="space-y-6">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 relative">
                                {/* Currency Button - Top Right */}
                                <Link
                                    href="/settings/currency"
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </Link>

                                <div className="text-center">
                                    {/* Avatar */}
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white flex items-center justify-center shadow-lg">
                                            {auth?.user?.avatar ? (
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
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Name with Edit Icon */}
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-xl font-bold text-white">
                                            {auth?.user?.name}
                                        </h2>
                                        <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    
                                    {/* Email */}
                                    <p className="text-sm text-orange-100 mb-3">{auth?.user?.email}</p>
                                    
                                    {/* Status Badge */}
                                    {/* <div className="flex justify-center gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                                            {auth?.user?.email_verified_at ? (
                                                <>
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Email Verificado
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Email Pendiente
                                                </>
                                            )}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                                <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Zona de Peligro</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="bg-red-100 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9-4v4" />
                                    </svg>
                                    <div className="text-sm text-red-700">
                                        <strong>Importante:</strong> Si eliminas tu cuenta, <span className="font-semibold">los procesos de pago con tarjeta Gastaro Pay que estén en curso seguirán activos</span> por protección de terceros, deTérminos y Condiciones de uso de Gastaro Pay. 
                                        <br />
                                        Asegúrate de finalizar cualquier transacción pendiente antes de eliminar tu cuenta.
                                    </div>
                                </div>
                                <DeleteUser />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Version */}
            <div className="hidden md:block">
                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall
                            title="Profile information"
                            description="Update your name and email address"
                        />

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>
                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} data-test="update-profile-button">
                                    Save
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Saved</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    <DeleteUser />
                </SettingsLayout>
            </div>
        </AdaptiveLayout>
    );
}
