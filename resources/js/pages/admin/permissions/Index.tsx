import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/permissions/column';
import permissions from '@/routes/admin/permissions';
import { BreadcrumbItem } from '@/types';
import { PaginationPermissions } from '@/types/admin/permissions';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: permissions.index().url,
    },
];

export default function Index({ permissions }: Readonly<{ permissions: PaginationPermissions }>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Listing Permissions" />

            <div className="px-4 py-6">
                <Heading
                    title="Permissions"
                    description="You can manage all permissions. View, edit, and delete permissions as needed."
                />

                <section aria-label="Permissions Table">
                    <DataTable columns={columns} data={permissions.data} pagination={permissions} />
                </section>
            </div>
        </Layout>
    );
}
