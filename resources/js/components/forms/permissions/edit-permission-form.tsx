import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import permissions from '@/routes/admin/permissions';
import { Permission } from '@/types/admin/permissions';
import { Form, Link } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';

export default function EditPermissionForm({
    permission,
    defaultGuard,
}: Readonly<{
    permission: Permission;
    defaultGuard: string;
}>) {
    return (
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
                        <Input id="name" name="name" defaultValue={permission.name} readOnly disabled aria-disabled />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input id="title" name="title" defaultValue={permission.title} aria-invalid={!!errors.title} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="guard_name">Guard Name (system default: {defaultGuard})</FieldLabel>

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
    );
}
