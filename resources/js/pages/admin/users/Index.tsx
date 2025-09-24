import { DataTable } from '@/components/data-table';
import Layout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/users/column';
import { PaginationUsers } from '@/types/admin/users';
import { Head } from '@inertiajs/react';

export default function Index({ users }: Readonly<{ users: PaginationUsers }>) {
    return (
        <Layout>
            <Head title="Index" />

            <DataTable columns={columns} data={users.data} pagination={users} />
        </Layout>
    );
}
