import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { columns } from '@/pages/admin/users/column';
import { SharedData } from '@/types';
import { PaginationUsers } from '@/types/admin/users';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Index({ users }: Readonly<{ users: PaginationUsers }>) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (!flash || !Object.values(flash).some(Boolean)) return;

        if (flash.success) toast.success(flash.success);
        else if (flash.error) toast.error(flash.error);
        else if (flash.info) toast(flash.info);
        else if (flash.warning) toast.warning(flash.warning);
    }, [flash]);

    return (
        <Layout>
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
