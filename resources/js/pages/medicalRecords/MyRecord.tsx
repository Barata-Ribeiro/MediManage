import Layout from '@/layouts/app-layout';
import { myRecord } from '@/routes/medicalRecords';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Medical Record',
        href: myRecord().url,
    },
];

export default function MyRecord({ medicalRecord }) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="My Medical Record" />
            <pre>{JSON.stringify(medicalRecord, null, 2)}</pre>
        </Layout>
    );
}
