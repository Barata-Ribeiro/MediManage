import AppPagination from '@/components/app-pagination';
import EditRoleForm from '@/components/forms/admin/roles/edit-role-form';
import SearchPermissionsForm from '@/components/forms/admin/roles/search-permissions-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import roles from '@/routes/admin/roles';
import type { BreadcrumbItem } from '@/types';
import { PaginationPermissions } from '@/types/admin/permissions';
import { Role } from '@/types/admin/roles';
import { Head, Link } from '@inertiajs/react';

interface EditProps {
    role: Role;
    allPermissions: PaginationPermissions;
}

export default function Edit({ role, allPermissions }: Readonly<EditProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: roles.index().url,
        },
        {
            title: `Edit ${role.name}`,
            href: roles.edit(role.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${role.name}`} />
            <section className="container max-w-xl px-4 pt-8 sm:px-6 lg:px-8">
                <Heading
                    title="Edit Role"
                    description="Update the role name and save changes. Changes take effect immediately."
                />

                <Item variant="outline">
                    <ItemContent>
                        <EditRoleForm roleId={role.id} roleName={role.name} />
                    </ItemContent>
                </Item>
            </section>

            <Separator className="container my-8 max-w-xl" />

            <section className="container max-w-xl space-y-2 px-4 pb-8 sm:px-6 lg:px-8">
                <Heading
                    title="Permissions"
                    description="Grant or revoke permissions for this role. Changes take effect immediately."
                />

                <SearchPermissionsForm roleId={role.id} />

                {allPermissions.data.map((permission) => {
                    const key = `permission-${permission.id}`;
                    const hasPermission = role.permissions?.some((p) => p.name === permission.name);

                    return (
                        <Item key={key} variant="muted">
                            <ItemContent>
                                <ItemTitle className="text-lg font-bold">{permission.title}</ItemTitle>
                                <ItemDescription>
                                    Permission: <span className="font-mono">{permission.name}</span>
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <Button variant={hasPermission ? 'destructive' : 'default'} asChild>
                                    <Link
                                        href={admin.roles.togglePermission({
                                            role: role.id,
                                            permission: permission.id,
                                        })}
                                        method="patch"
                                        as="button"
                                    >
                                        {hasPermission ? 'Revoke' : 'Grant'}
                                    </Link>
                                </Button>
                            </ItemActions>
                        </Item>
                    );
                })}

                <AppPagination pagination={allPermissions} />
            </section>
        </Layout>
    );
}
