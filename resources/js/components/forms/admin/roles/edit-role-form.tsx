import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Link } from '@inertiajs/react';
import { Fragment } from 'react';

export default function EditRoleForm({ roleId, roleName }: Readonly<{ roleId: number; roleName: string }>) {
    return (
        <Form
            {...RoleController.update.form(roleId)}
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
                            defaultValue={roleName}
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
    );
}
