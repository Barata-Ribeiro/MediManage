import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import AppPagination from '@/components/app-pagination';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldLabel } from '@/components/ui/field';
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
import { EraserIcon, SearchIcon } from 'lucide-react';
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
            title: `Edit ${role.name}`,
            href: RoleController.edit(role.id).url,
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

                                    <div className="inline-flex items-center gap-x-2">
                                        <Button type="button" variant="ghost" asChild>
                                            <Link href={RoleController.index()} prefetch>
                                                Go back
                                            </Link>
                                        </Button>
                                        <Button type="submit">Save</Button>
                                    </div>
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
                    {...admin.roles.edit.form(role.id)}
                    options={{ preserveScroll: true }}
                    disableWhileProcessing
                    className="mb-4 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                >
                    <Field>
                        <FieldLabel htmlFor="search">Search Permissions</FieldLabel>
                        <ButtonGroup>
                            <Input type="search" id="search" name="search" placeholder="e.g. create.user" />
                            <Button
                                type="button"
                                variant="outline"
                                aria-label="Reset results"
                                title="Reset results"
                                asChild
                            >
                                <Link href={admin.roles.edit(role.id)} prefetch as="button">
                                    <EraserIcon aria-hidden />
                                </Link>
                            </Button>
                            <Button type="submit" aria-label="Search" title="Search">
                                <SearchIcon aria-hidden />
                            </Button>
                        </ButtonGroup>
                    </Field>
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
