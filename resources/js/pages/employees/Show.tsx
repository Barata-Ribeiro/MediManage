import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app-layout';
import employee_info from '@/routes/employee_info';
import { BreadcrumbItem } from '@/types';
import { EmployeeInfoWithRelations } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

export default function Show({ employee: data }: Readonly<{ employee: EmployeeInfoWithRelations }>) {
    const getInitials = useInitials();
    const { user, contracts, ...rest } = data;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employee_info.index().url,
        },
        {
            title: `${rest.full_name}`,
            href: employee_info.show(data.id).url,
        },
    ];

    // TODO: Remove console logs after finishing page implementation
    console.group('Employee Details');
    console.log('User Data:', user);
    console.log('Contracts:', contracts);
    console.log('Employee Info:', rest);
    console.groupEnd();

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={rest.full_name} />

            {/* TODO: Implement employee details UI */}
            <article className="container py-2">
                <h2 className="text-lg font-semibold">Employee Details</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </article>
        </Layout>
    );
}
