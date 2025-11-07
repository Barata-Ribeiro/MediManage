import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/employees/column';
import employee_info from '@/routes/employee_info';
import { BreadcrumbItem } from '@/types';
import { PaginationEmployees } from '@/types/application/employee';
import { Head, Link } from '@inertiajs/react';
import { UserPlusIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employee_info.index().url,
    },
];

export default function Index({ employees }: Readonly<{ employees: PaginationEmployees }>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Listing All Employees" />

            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Employees" description="Listing all employees in the system." />

                    <Button variant="secondary" asChild>
                        <Link href={employee_info.create()} prefetch>
                            <UserPlusIcon aria-hidden /> Register Employee
                        </Link>
                    </Button>
                </div>

                <section aria-label="Employees Table">
                    <DataTable columns={column} data={employees.data} pagination={employees} />
                </section>
            </div>
        </Layout>
    );
}
