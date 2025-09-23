import AppLayout from '@/layouts/app-layout';
import roles from '@/routes/admin/roles';
import { BreadcrumbItem } from '@/types';
import { PaginationRoles } from '@/types/admin/roles';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: roles.index().url,
    },
];

export default function Index({ roles }: Readonly<{ roles: PaginationRoles }>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            {/*TODO: Implement role table*/}
            {JSON.stringify(roles)}
        </AppLayout>
    );
}
