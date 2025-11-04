import EmployeePaymentByMonthChart from '@/components/charts/employee-payment-by-month-chart';
import EmployeesByPositionChart from '@/components/charts/employees-by-position-chart';
import NewPatientsByMonthChart from '@/components/charts/new-patients-by-month-chart';
import DashboardHeader from '@/components/helpers/dashboard-header';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, ChartItem } from '@/types';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

// TODO: Add element to display total patients
export interface TotalPatients {
    total: number;
    percentage_change: number;
}

// TODO: Add element to display contracts data and chart
export interface ContractsData {
    total_contracts: number;
    active_contracts: number;
    contracts_by_type: ChartItem;
    total_earnings_current_month: number;
}

// TODO: Add element to display invoices data
export interface InvoicesData {
    total_invoices: number;
    total_amount: number;
    pending_invoices: number;
    paid_invoices: number;
    pending_amount: number;
}

export interface EmployeePaymentsData {
    total_payments: number;
    total_amount_paid: number;
    payments_by_month: ChartItem;
}

interface ManagerDashboardProps {
    data: {
        managerInfo: EmployeeInfo;
        employeesByPosition: ChartItem;
        totalPatients: TotalPatients;
        newPatientsByMonth: ChartItem;
        contractsData: ContractsData;
        invoicesData: InvoicesData;
        employeePaymentsData: EmployeePaymentsData;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function ManagerDashboard({ data }: Readonly<ManagerDashboardProps>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardHeader
                    avatar={data.managerInfo.user?.avatar}
                    fullName={data.managerInfo.full_name}
                    email={data.managerInfo.user?.email}
                    phoneNumber={data.managerInfo.phone_number}
                    dateOfBirth={data.managerInfo.date_of_birth}
                    age={data.managerInfo.age}
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <NewPatientsByMonthChart chartData={data.newPatientsByMonth} />

                    <EmployeePaymentByMonthChart chartData={data.employeePaymentsData} />

                    <EmployeesByPositionChart chartData={data.employeesByPosition} />
                </div>
            </div>
        </AppLayout>
    );
}
