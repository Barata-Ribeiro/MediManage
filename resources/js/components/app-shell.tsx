import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface AppShellProps {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: Readonly<AppShellProps>) {
    const { sidebarOpen: isOpen, flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (!flash || !Object.values(flash).some(Boolean)) return;

        if (flash.success) toast.success(flash.success);
        else if (flash.error) toast.error(flash.error);
        else if (flash.info) toast(flash.info);
        else if (flash.warning) toast.warning(flash.warning);
    }, [flash]);

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            {children}
            <Toaster />
        </SidebarProvider>
    );
}
