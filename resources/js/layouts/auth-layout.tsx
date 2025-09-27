import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import type { ReactNode } from 'react';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: Readonly<{
    children: ReactNode;
    title: string;
    description: string;
}>) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
