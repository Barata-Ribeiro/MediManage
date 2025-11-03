import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

interface ManagerDashboardProps {
    data: {
        managerInfo: EmployeeInfo;
        [key: string]: unknown;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function ManagerDashboard({ data }: Readonly<ManagerDashboardProps>) {
    console.group('Manager Info');
    console.log(data);
    console.groupEnd();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager Dashboard" />
        </AppLayout>
    );
}
