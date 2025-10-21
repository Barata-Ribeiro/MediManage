import DashboardHeader from '@/components/helpers/dashboard-header';
import UserDashboardHeader from '@/components/helpers/user-dashboard-header';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/admin/users';
import { AppointmentWithRelations } from '@/types/application/appointment';
import { UserWithPatientInfo } from '@/types/application/patient';
import { Head } from '@inertiajs/react';

interface UserDashboardProps {
    data: {
        appointments: AppointmentWithRelations[];
        profile: UserWithPatientInfo;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function userDashboard({ data }: Readonly<UserDashboardProps>) {
    const hasAppointments = data.appointments.length > 0;
    const hasPatientInfo = !!data.profile.patient_info;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {hasPatientInfo ? (
                    <DashboardHeader
                        avatar={data.profile.avatar}
                        fullName={data.profile.patient_info?.full_name}
                        email={data.profile.email}
                        phoneNumber={data.profile.patient_info!.phone_number}
                        dateOfBirth={data.profile.patient_info!.date_of_birth}
                        age={data.profile.patient_info!.age}
                    />
                ) : (
                    <UserDashboardHeader user={data.profile as User} />
                )}
            </div>
        </AppLayout>
    );
}
