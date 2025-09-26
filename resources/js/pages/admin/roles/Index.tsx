import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/roles/column';
import roles from '@/routes/admin/roles';
import { BreadcrumbItem, SharedData } from '@/types';
import { PaginationRoles } from '@/types/admin/roles';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: roles.index().url,
    },
];

export default function Index({ roles }: Readonly<{ roles: PaginationRoles }>) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (!flash || !Object.values(flash).some(Boolean)) return;

        if (flash.success) toast.success(flash.success);
        else if (flash.error) toast.error(flash.error);
        else if (flash.info) toast(flash.info);
        else if (flash.warning) toast.warning(flash.warning);
    }, [flash]);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="px-4 py-6">
                <Heading title="Roles" description="You can manage all roles. Edit and delete roles as needed." />

                <section aria-label="Roles Table">
                    <DataTable columns={columns} data={roles.data} pagination={roles} />
                </section>
            </div>
        </Layout>
    );
}
