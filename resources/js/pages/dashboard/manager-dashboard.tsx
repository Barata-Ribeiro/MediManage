import ContractByTypeChart from '@/components/charts/contract-by-type-chart';
import EmployeePaymentByMonthChart from '@/components/charts/employee-payment-by-month-chart';
import EmployeesByPositionChart from '@/components/charts/employees-by-position-chart';
import NewPatientsByMonthChart from '@/components/charts/new-patients-by-month-chart';
import DashboardHeader from '@/components/helpers/dashboard-header';
import ManagerSectionCards from '@/components/helpers/manager-section-cards';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, ChartItem } from '@/types';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

export interface TotalPatients {
    total: number;
    percentage_change: number;
}

export interface ContractsData {
    total_contracts: number;
    active_contracts: number;
    contracts_by_type: ChartItem;
}

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

                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <ManagerSectionCards invoiceData={data.invoicesData} totalPatients={data.totalPatients} />

                        <NewPatientsByMonthChart chartData={data.newPatientsByMonth} />

                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <EmployeePaymentByMonthChart chartData={data.employeePaymentsData} />

                            <EmployeesByPositionChart chartData={data.employeesByPosition} />

                            <ContractByTypeChart {...data.contractsData} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
