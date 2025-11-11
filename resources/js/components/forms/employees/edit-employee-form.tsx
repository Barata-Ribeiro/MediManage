import employee_info from '@/routes/employee_info';
import { EmployeeInfoWithRelations } from '@/types/application/employee';
import { Form } from '@inertiajs/react';
import { Fragment, useState } from 'react';

import AppPageAlert from '@/components/app-page-alert';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDownIcon } from 'lucide-react';

interface EditEmployeeFormProps {
    employee: Omit<EmployeeInfoWithRelations, 'medical_record' | 'contracts'>;
}

export default function EditEmployeeForm({ employee }: Readonly<EditEmployeeFormProps>) {
    // Date Pickers State
    const [bodOpen, setBodOpen] = useState(false);
    const [ledOpen, setLedOpen] = useState(false);

    // Form Related States
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(employee.date_of_birth));
    const [licenseExpirationDate, setLicenseExpirationDate] = useState<Date | undefined>(
        employee.license_expiry_date ? new Date(employee.license_expiry_date) : undefined,
    );

    return (
        <Form
            {...employee_info.update.form(employee.id)}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            disableWhileProcessing
            transform={(data) => ({
                ...data,
                date_of_birth: dateOfBirth?.toISOString().split('T')[0] ?? null,
                license_expiration_date: licenseExpirationDate?.toISOString().split('T')[0] ?? null,
            })}
        >
            {({ errors, resetAndClearErrors }) => (
                <Fragment>
                    <h3 className="text-lg leading-6 font-bold underline underline-offset-2">Employee Information</h3>

                    {/* ACCOUNT */}
                    <FieldSet className="rounded-lg border bg-background p-4">
                        <FieldLegend className="px-1 font-semibold">Account Information</FieldLegend>
                        <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field aria-invalid={Boolean(errors.name)}>
                                <FieldLabel htmlFor="name">Username</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={0}
                                    name="name"
                                    defaultValue={employee.user?.name}
                                    required
                                    aria-required
                                    aria-invalid={Boolean(errors.name)}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </Field>

                            <Field aria-invalid={Boolean(errors.email)}>
                                <FieldLabel htmlFor="email">Email address</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    defaultValue={employee.user?.email}
                                    required
                                    aria-required
                                    aria-invalid={Boolean(errors.email)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </Field>

                            <Field aria-invalid={Boolean(errors.avatar)}>
                                <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                                <Input
                                    id="avatar"
                                    type="text"
                                    name="avatar"
                                    defaultValue={employee.user?.avatar ?? ''}
                                    placeholder="e.g. https://example.com/avatar.jpg"
                                    aria-invalid={Boolean(errors.avatar)}
                                />

                                <InputError message={errors.avatar} className="mt-2" />
                            </Field>

                            <Field aria-invalid={Boolean(errors.bio)}>
                                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={employee.user?.bio ?? ''}
                                    placeholder="Write a short biography about yourself..."
                                    maxLength={500}
                                />

                                <InputError message={errors.bio} className="mt-2" />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* PERSONAL DETAILS */}
                    <FieldSet className="rounded-lg border bg-background p-4">
                        <FieldLegend className="px-1 font-semibold">Personal Details</FieldLegend>
                        <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    defaultValue={employee.first_name}
                                    aria-invalid={Boolean(errors.first_name)}
                                    required
                                    aria-required
                                />
                                <InputError message={errors.first_name} className="mt-2" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    defaultValue={employee.last_name}
                                    aria-invalid={Boolean(errors.last_name)}
                                    required
                                    aria-required
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                                <Input
                                    id="gender"
                                    name="gender"
                                    type="text"
                                    defaultValue={employee.gender}
                                    aria-invalid={Boolean(errors.gender)}
                                    required
                                    aria-required
                                />
                                <InputError message={errors.gender} className="mt-2" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
                                <Popover open={bodOpen} onOpenChange={setBodOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select date'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateOfBirth ?? undefined}
                                            captionLayout="dropdown"
                                            showOutsideDays={false}
                                            disabled={(date) => date < new Date('1900-01-01')}
                                            onSelect={(date) => {
                                                setDateOfBirth(date!);
                                                setBodOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.date_of_birth} className="mt-2" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone_number">Phone Number</FieldLabel>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    defaultValue={employee.phone_number}
                                    aria-invalid={Boolean(errors.phone_number)}
                                    required
                                    aria-required
                                />
                                <InputError message={errors.phone_number} className="mt-2" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="address">Address</FieldLabel>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    defaultValue={employee.address}
                                    aria-invalid={Boolean(errors.address)}
                                    required
                                    aria-required
                                />
                                <InputError message={errors.address} className="mt-2" />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* DOCTOR INFORMATION */}
                    <FieldSet className="rounded-lg border bg-background p-4">
                        <FieldLegend className="px-1 font-semibold">Doctor Information</FieldLegend>

                        <AppPageAlert
                            variant="info"
                            title="Optional Information"
                            message="If the employee is not a doctor, leave the following fields blank."
                        />

                        {/* Registration */}
                        <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="registration_number">Registration Number</FieldLabel>
                                <Input
                                    id="registration_number"
                                    name="registration_number"
                                    type="text"
                                    defaultValue={employee.registration_number ?? ''}
                                    aria-invalid={Boolean(errors.registration_number)}
                                    placeholder="e.g. REG123456"
                                />
                                <InputError message={errors.registration_number} className="mt-2" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="registration_origin">Registration Origin</FieldLabel>
                                <Input
                                    id="registration_origin"
                                    name="registration_origin"
                                    type="text"
                                    defaultValue={employee.registration_origin ?? ''}
                                    placeholder="e.g. Medical Board"
                                    aria-invalid={Boolean(errors.registration_origin)}
                                />
                                <InputError message={errors.registration_origin} className="mt-2" />
                            </Field>
                        </FieldGroup>

                        {/* License */}
                        <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="license_number">License Number</FieldLabel>
                                <Input
                                    id="license_number"
                                    name="license_number"
                                    type="text"
                                    defaultValue={employee.license_number ?? ''}
                                    placeholder="e.g. MED123456"
                                    aria-invalid={Boolean(errors.license_number)}
                                />
                                <InputError message={errors.license_number} className="mt-2" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="license_expiration_date">License Expiration Date</FieldLabel>
                                <Popover open={ledOpen} onOpenChange={setLedOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {licenseExpirationDate
                                                ? licenseExpirationDate.toLocaleDateString()
                                                : 'Select date'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={licenseExpirationDate ?? undefined}
                                            captionLayout="dropdown"
                                            showOutsideDays={false}
                                            startMonth={new Date()}
                                            endMonth={new Date(2030, 11)}
                                            disabled={(date) => date < new Date('1900-01-01')}
                                            onSelect={(date) => {
                                                setLicenseExpirationDate(date);
                                                setLedOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.license_expiration_date} className="mt-2" />
                            </Field>
                        </FieldGroup>

                        {/* Specialization */}
                        <Field>
                            <FieldLabel htmlFor="specialization">Specialization</FieldLabel>
                            <Input
                                id="specialization"
                                name="specialization"
                                type="text"
                                defaultValue={employee.specialization ?? ''}
                                placeholder="e.g. Cardiology"
                                aria-invalid={Boolean(errors.specialization)}
                            />
                            <InputError message={errors.specialization} className="mt-2" />
                        </Field>
                    </FieldSet>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                resetAndClearErrors();
                                setDateOfBirth(new Date(employee.date_of_birth));
                            }}
                        >
                            Clear Form
                        </Button>
                    </div>
                </Fragment>
            )}
        </Form>
    );
}
