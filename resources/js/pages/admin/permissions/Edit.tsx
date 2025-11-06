import AppPageAlert from '@/components/app-page-alert';
import EditPermissionForm from '@/components/forms/permissions/edit-permission-form';
import Heading from '@/components/heading';
import { Item, ItemContent } from '@/components/ui/item';
import Layout from '@/layouts/app-layout';
import permissions from '@/routes/admin/permissions';
import { BreadcrumbItem } from '@/types';
import { Permission } from '@/types/admin/permissions';
import { Head } from '@inertiajs/react';

interface EditProps {
    permission: Permission;
    defaultGuard: string;
}

export default function Edit({ permission, defaultGuard }: Readonly<EditProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Permissions',
            href: permissions.index().url,
        },
        {
            title: permission.name,
            href: permissions.show(permission.id).url,
        },
        {
            title: `Editing #${permission.name}`,
            href: permissions.edit(permission.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Permission: ${permission.name}`} />

            <section className="container max-w-xl px-4 pt-8 sm:px-6 lg:px-8">
                <Heading
                    title="Edit Permission"
                    description="Update the permission details and save changes. Changes take effect immediately."
                />

                <AppPageAlert
                    variant="warning"
                    title="Caution"
                    message="Modifying permissions can impact system security and user access. Ensure you understand the implications before making changes."
                />

                <Item variant="outline">
                    <ItemContent>
                        <EditPermissionForm permission={permission} defaultGuard={defaultGuard} />
                    </ItemContent>
                </Item>
            </section>
        </Layout>
    );
}
