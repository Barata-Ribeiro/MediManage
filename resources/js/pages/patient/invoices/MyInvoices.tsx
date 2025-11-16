import Heading from '@/components/heading';
import { DataTable } from '@/components/table/data-table';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/patient/invoices/column';
import { myInvoices } from '@/routes/invoices';
import { BreadcrumbItem } from '@/types';
import { PaginationInvoice } from '@/types/application/invoice';
import { Head } from '@inertiajs/react';

interface MyInvoicesProps {
    invoices: PaginationInvoice;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Invoices',
        href: myInvoices().url,
    },
];

export default function MyInvoices({ invoices }: Readonly<MyInvoicesProps>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="My Invoices" />

            <div className="px-4 py-6">
                <Heading title="My Invoices" description="Manage your invoices here." />

                <section aria-label="Invoices Table">
                    <DataTable columns={column} data={invoices.data} pagination={invoices} />
                </section>
            </div>
        </Layout>
    );
}
