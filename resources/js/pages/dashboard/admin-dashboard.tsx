import AdminStatsCards from '@/components/admin/admin-stats-cards';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, ChartItem, ComparisonItem } from '@/types';
import { Role } from '@/types/admin/roles';
import { Head } from '@inertiajs/react';

export type TotalUsersByRole = Record<Pick<Role, 'name'>['name'], ComparisonItem>;

interface AdminDashboardProps {
    data: {
        usersByRole: ChartItem;
        totalUsers: ComparisonItem;
        newUsersPerMonth: ChartItem;
        totalUsersByRole: TotalUsersByRole;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function AdminDashboard({ data }: Readonly<AdminDashboardProps>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <AdminStatsCards users={data.totalUsers} usersByRole={data.totalUsersByRole} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
