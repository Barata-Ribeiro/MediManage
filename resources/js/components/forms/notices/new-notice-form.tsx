import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { normalizeString } from '@/lib/utils';
import notices from '@/routes/notices';
import { NoticeType } from '@/types/application/enums';
import { Field } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

function NewNoticeForm() {
    const [isActive, setIsActive] = useState(false);

    const noticeTypes = Object.values(NoticeType).map((v) => ({
        value: String(v),
        label: normalizeString(String(v)),
    }));

    return (
        <Form
            {...notices.store.form()}
            options={{ preserveScroll: true }}
            disableWhileProcessing
            className="space-y-6 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
            transform={(data) => ({
                ...data,
                is_active: isActive,
            })}
        >
            {({ errors, resetAndClearErrors }) => (
                <Fragment>
                    <Field className="space-y-2">
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Scheduled Maintenance"
                            required
                            aria-required
                            aria-invalid={!!errors.title}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </Field>

                    <Field className="space-y-2">
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                            id="description"
                            name="description"
                            rows={4}
                            maxLength={255}
                            placeholder="e.g. Our services will be down for maintenance on Saturday from 1 AM to 3 AM."
                            required
                            aria-required
                            aria-invalid={!!errors.description}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </Field>

                    <Field className="space-y-2">
                        <FieldLabel htmlFor="type">Entry Type</FieldLabel>

                        <Select name="type">
                            <SelectTrigger id="type" aria-invalid={!!errors.type}>
                                <SelectValue placeholder="Choose notice type" />
                            </SelectTrigger>
                            <SelectContent>
                                {noticeTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.type} className="mt-2" />
                    </Field>

                    <div
                        {...(!!errors.is_active && { 'aria-invalid': 'true' })}
                        className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm aria-invalid:border-destructive"
                    >
                        <div className="space-y-0.5">
                            <FieldLabel htmlFor="is_active">
                                {isActive ? 'People Can See' : 'People Cannot See'}
                            </FieldLabel>
                            <p className="text-sm text-muted-foreground">
                                {isActive
                                    ? 'Everyone will be able to view this notice.'
                                    : 'Everyone will not be able to view this notice.'}
                            </p>

                            <InputError message={errors.is_active} className="mt-2" />
                        </div>

                        <Switch id="is_active" name="is_active" checked={isActive} onCheckedChange={setIsActive} />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Button type="submit">Create Notice</Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetAndClearErrors();
                                setIsActive(false);
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </Fragment>
            )}
        </Form>
    );
}

export default NewNoticeForm;
