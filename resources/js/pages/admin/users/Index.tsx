import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/users/column';
import { PaginationUsers } from '@/types/admin/users';
import { Head } from '@inertiajs/react';

export default function Index({ users }: Readonly<{ users: PaginationUsers }>) {
    return (
        <Layout>
            <Head title="Index" />

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
