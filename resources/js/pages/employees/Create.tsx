import NewEmployeeForm from '@/components/forms/employees/new-employee-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import employee_info from '@/routes/employee_info';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employee_info.index().url,
    },
    {
        title: 'New Employee',
        href: employee_info.create().url,
    },
];

export default function Create() {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Register New Employee" />

            <div className="px-4 py-6">
                <Heading
                    title="Register New Employee"
                    description="Fill in the details to register a new employee. Consult with the person for all required information."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <NewEmployeeForm />
                </section>
            </div>
        </Layout>
    );
}
