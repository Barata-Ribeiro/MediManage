import AppPageAlert from '@/components/app-page-alert';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent } from '@/components/ui/item';
import Layout from '@/layouts/app-layout';
import permissions from '@/routes/admin/permissions';
import { BreadcrumbItem } from '@/types';
import { Permission } from '@/types/admin/permissions';
import { Form, Head, Link } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';

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
                        <Form
                            {...permissions.update.form(permission.id)}
                            options={{ preserveScroll: true }}
                            disableWhileProcessing
                            className="space-y-6 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                        >
                            {({ errors }) => (
                                <Fragment>
                                    <Field>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={permission.name}
                                            readOnly
                                            disabled
                                            aria-disabled
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="title">Title</FieldLabel>
                                        <Input
                                            id="title"
                                            name="title"
                                            defaultValue={permission.title}
                                            aria-invalid={!!errors.title}
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="guard_name">
                                            Guard Name (system default: {defaultGuard})
                                        </FieldLabel>

                                        <Input
                                            id="guard_name"
                                            name="guard_name"
                                            defaultValue={permission.guard_name}
                                            aria-invalid={!!errors.guard_name}
                                        />
                                        <InputError message={errors.guard_name} className="mt-2" />
                                    </Field>

                                    <div className="inline-flex items-center gap-x-2">
                                        <Button type="button" variant="ghost" asChild>
                                            <Link href={permissions.show(permission.id)} prefetch>
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
        </Layout>
    );
}
