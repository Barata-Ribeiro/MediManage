import EditEmployeeForm from '@/components/forms/employees/edit-employee-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import employee_info from '@/routes/employee_info';
import { BreadcrumbItem } from '@/types';
import { EmployeeInfoWithRelations } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

export default function Edit({
    employee,
}: Readonly<{ employee: Omit<EmployeeInfoWithRelations, 'medical_record' | 'contracts'> }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employee_info.index().url,
        },
        {
            title: employee.full_name!,
            href: employee_info.show(employee.id).url,
        },
        {
            title: 'Edit',
            href: employee_info.edit(employee.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Employee - ${employee.full_name}`} />

            <div className="px-4 py-6">
                <Heading
                    title={`Editing Employee - ${employee.full_name}`}
                    description="Make changes to the employee's information. Ensure all details are accurate before saving."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <EditEmployeeForm employee={employee} />
                </section>
            </div>
        </Layout>
    );
}
