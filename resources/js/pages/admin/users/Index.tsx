import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/table/data-table';
import Layout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/users/column';
import type { BreadcrumbItem } from '@/types';
import { PaginationUsers } from '@/types/admin/users';
import { Head } from '@inertiajs/react';

export default function Index({ users }: Readonly<{ users: PaginationUsers }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: UserManagementController.index().url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Listing Users" />

            <div className="px-4 py-6">
                <Heading
                    title="Users"
                    description="You can manage all user accounts. View, edit, and delete users as needed."
                />

                <section aria-label="Users Table">
                    <DataTable columns={columns} data={users.data} pagination={users} />
                </section>
            </div>
        </Layout>
    );
}
