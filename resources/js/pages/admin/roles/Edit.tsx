import Layout from '@/layouts/app-layout';
import { Role } from '@/types/admin/roles';
import { Head } from '@inertiajs/react';

export default function Edit({ role }: Readonly<{ role: Role }>) {
    return (
        <Layout>
            <Head title={`Edit ${role.name}`} />
            <pre>{JSON.stringify(role, null, 2)}</pre>
        </Layout>
    );
}
