import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/notices/column';
import notices from '@/routes/notices';
import { BreadcrumbItem } from '@/types';
import { PaginationNotice } from '@/types/application/notice';
import { Head, Link } from '@inertiajs/react';
import { NotebookPenIcon } from 'lucide-react';

interface IndexProps {
    notices: PaginationNotice;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notices',
        href: notices.index().url,
    },
];

export default function Index({ notices }: Readonly<IndexProps>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Notices" />

            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Notices" description="Listing all notices." />

                    <Button variant="secondary" asChild>
                        {/* TODO: Implement notice creation */}
                        <Link href={'#'} prefetch>
                            <NotebookPenIcon aria-hidden /> Write Notice
                        </Link>
                    </Button>
                </div>

                <section aria-label="Notices Table">
                    <DataTable columns={column} data={notices.data} pagination={notices} />
                </section>
            </div>
        </Layout>
    );
}
