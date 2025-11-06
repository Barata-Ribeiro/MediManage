import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import { Form, Link } from '@inertiajs/react';
import { EraserIcon, SearchIcon } from 'lucide-react';

export default function SearchPermissionsForm({ roleId }: Readonly<{ roleId: number }>) {
    return (
        <Form
            {...admin.roles.edit.form(roleId)}
            options={{ preserveScroll: true }}
            disableWhileProcessing
            className="mb-4 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
        >
            <Field>
                <FieldLabel htmlFor="search">Search Permissions</FieldLabel>
                <ButtonGroup>
                    <Input type="search" id="search" name="search" placeholder="e.g. create.user" />
                    <Button type="button" variant="outline" aria-label="Reset results" title="Reset results" asChild>
                        <Link href={admin.roles.edit(roleId)} prefetch as="button">
                            <EraserIcon aria-hidden />
                        </Link>
                    </Button>
                    <Button type="submit" aria-label="Search" title="Search">
                        <SearchIcon aria-hidden />
                    </Button>
                </ButtonGroup>
            </Field>
        </Form>
    );
}
