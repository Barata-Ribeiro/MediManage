import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Role } from '@/types/admin/roles';
import { Form, Head } from '@inertiajs/react';
import { Fragment } from 'react';

export default function Edit({ role }: Readonly<{ role: Role }>) {
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

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${role.name}`} />
            <section
                aria-labelledby="edit-role-title"
                aria-describedby="edit-role-desc"
                className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8"
            >
                <div className="mb-6">
                    <h1 id="edit-role-title" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        Edit Role
                    </h1>
                    <p id="edit-role-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Update the role name and save changes. Changes take effect immediately.
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-6 shadow-sm dark:border-slate-700">
                    {/*TODO: Implement permissions management later*/}
                    <Form
                        {...RoleController.update.form(role.id)}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <Fragment>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        className="block w-full"
                                        defaultValue={role.name}
                                        name="name"
                                        placeholder="e.g. Administrator"
                                        disabled={processing}
                                        aria-invalid={Boolean(errors.name)}
                                        autoFocus
                                        required
                                        aria-required
                                    />

                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <Button disabled={processing}>Save</Button>
                            </Fragment>
                        )}
                    </Form>
                </div>
            </section>
        </Layout>
    );
}
