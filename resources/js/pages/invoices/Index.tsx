import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/invoices/column';
import invoices from '@/routes/invoices';
import { BreadcrumbItem } from '@/types';
import { PaginationInvoiceWithRelations } from '@/types/application/invoice';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: invoices.index().url,
    },
];

interface IndexProps {
    invoices: PaginationInvoiceWithRelations;
}

export default function Index({ invoices }: Readonly<IndexProps>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Listing Invoices" />

            <div className="px-4 py-6">
                <Heading title="Invoices" description="Listing all the invoices in the system." />

                <section aria-label="Invoices Table">
                    <DataTable columns={column} data={invoices.data} pagination={invoices} />
                </section>
            </div>
        </Layout>
    );
}
