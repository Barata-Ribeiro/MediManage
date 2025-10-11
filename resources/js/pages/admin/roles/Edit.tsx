import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import AppPagination from '@/components/app-pagination';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import { PaginationPermissions } from '@/types/admin/permissions';
import { Role } from '@/types/admin/roles';
import { Form, Head, Link } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { Fragment } from 'react';

interface EditProps {
    role: Role;
    allPermissions: PaginationPermissions;
}

export default function Edit({ role, allPermissions }: Readonly<EditProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: RoleController.index().url,
        },
        {
            title: 'Edit',
            href: RoleController.edit(role.id).url,
        },
    ];
    console.log({ role, allPermissions });
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
                        <Form
                            {...RoleController.update.form(role.id)}
                            options={{ preserveScroll: true }}
                            disableWhileProcessing
                            className="space-y-6 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                        >
                            {({ errors }) => (
                                <Fragment>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            className="block w-full"
                                            defaultValue={role.name}
                                            name="name"
                                            placeholder="e.g. Administrator"
                                            aria-invalid={Boolean(errors.name)}
                                            autoFocus
                                            required
                                            aria-required
                                        />

                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <Button>Save</Button>
                                </Fragment>
                            )}
                        </Form>
                    </ItemContent>
                </Item>
            </section>

            <Separator className="container my-8 max-w-xl" />

            <section className="container max-w-xl space-y-2 px-4 pb-8 sm:px-6 lg:px-8">
                <Heading
                    title="Permissions"
                    description="Grant or revoke permissions for this role. Changes take effect immediately."
                />

                <Form
                    method="GET"
                    options={{ preserveScroll: true }}
                    disableWhileProcessing
                    action={admin.roles.edit(role.id)}
                    className="mb-4 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                >
                    <Label htmlFor="search">Search Permissions</Label>
                    <ButtonGroup className="w-full">
                        <Input id="search" name="search" placeholder="e.g. create.user" autoComplete="off" />
                        <Button
                            type="submit"
                            variant="outline"
                            aria-label="Search permissions"
                            title="Search permissions"
                        >
                            <SearchIcon aria-hidden />
                        </Button>
                    </ButtonGroup>
                </Form>

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
