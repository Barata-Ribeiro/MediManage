import AdminStatsCards from '@/components/admin/admin-stats-cards';
import NewUsersByMonthChart from '@/components/charts/new-users-by-month-chart';
import UsersByRoleChart from '@/components/charts/users-by-role-chart';
import DashboardHeader from '@/components/helpers/dashboard-header';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, ChartItem, ComparisonItem } from '@/types';
import { Role } from '@/types/admin/roles';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

export type TotalUsersByRole = Record<Pick<Role, 'name'>['name'], ComparisonItem>;

interface AdminDashboardProps {
    data: {
        adminInfo: EmployeeInfo;
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardHeader
                    avatar={data.adminInfo.user?.avatar}
                    fullName={data.adminInfo.full_name}
                    email={data.adminInfo.user?.email}
                    phoneNumber={data.adminInfo.phone_number}
                    dateOfBirth={data.adminInfo.date_of_birth}
                    age={data.adminInfo.age}
                />

                <AdminStatsCards users={data.totalUsers} usersByRole={data.totalUsersByRole} />

                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <NewUsersByMonthChart chartData={data.newUsersPerMonth} />
                    <UsersByRoleChart total={data.totalUsers.total} chartData={data.usersByRole} />
                </div>
            </div>
        </AppLayout>
    );
}
