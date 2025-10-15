import AppPageAlert from '@/components/app-page-alert';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent } from '@/components/ui/item';
import Layout from '@/layouts/app-layout';
import patient_info from '@/routes/patient_info';
import { BreadcrumbItem } from '@/types';
import { PatientInfo } from '@/types/application/patient';
import { Form, Head } from '@inertiajs/react';
import { format } from 'date-fns';

interface NewAccountProps {
    patient: PatientInfo;
}

export default function NewAccount({ patient }: Readonly<NewAccountProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Patient Details',
            href: patient_info.show(patient.id).url,
        },
        {
            title: 'New Account',
            href: patient_info.newAccount(patient.id).url,
        },
    ];

    const dateOfBirth = String(patient?.date_of_birth).replaceAll('-', '/');
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="New Account" />

            <section className="container space-y-6 py-6">
                <header>
                    <Heading title="New Account" description="Create a new user account for this patient." />
                </header>

                <AppPageAlert
                    title={`Account details for patient (ID: ${patient.id})`}
                    message="The email you enter will be used as the account's login method and must be unique. Confirm
                        the email address with the patient before creating the account. The username can be random or
                        the patient can provide one."
                    variant="info"
                />

                <AppPageAlert
                    title="Password Information"
                    message="A temporary password will be sent to the provided email address. If the email is shared
                        (family/shared mailbox), advise the patient to change their password immediately after first
                        login or use a unique email. For issues, contact IT support."
                    variant="warning"
                />

                <Item variant="outline" aria-labelledby="personal-info">
                    <ItemContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>div>dd]:font-mono [&>div>dd]:text-sm [&>div>dt]:text-sm [&>div>dt]:font-semibold [&>div>dt]:text-muted-foreground">
                        <div>
                            <dt>Full name</dt>
                            <dd>{patient.full_name ?? 'N/A'}</dd>
                        </div>

                        <div>
                            <dt>Gender</dt>
                            <dd>{patient.gender ?? 'N/A'}</dd>
                        </div>

                        <div>
                            <dt>Date of birth</dt>
                            <dd>
                                <time dateTime={dateOfBirth}>{format(dateOfBirth, 'PPP')}</time> ({patient.age ?? 'N/A'}{' '}
                                years)
                            </dd>
                        </div>

                        <div>
                            <dt>Phone</dt>
                            <dd>{patient.phone_number}</dd>
                        </div>
                    </ItemContent>
                </Item>

                <Form
                    {...patient_info.storeNewAccount.form(patient.id)}
                    disableWhileProcessing
                    options={{ preserveScroll: true }}
                    className="mx-auto grid max-w-4xl gap-4 rounded-lg bg-card p-6 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                >
                    {({ errors }) => (
                        <>
                            <Field aria-invalid={Boolean(errors.name)}>
                                <FieldLabel htmlFor="name">Username</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={0}
                                    name="name"
                                    placeholder="e.g. johndoe"
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
                                    placeholder="e.g. email@example.com"
                                    required
                                    aria-required
                                    aria-invalid={Boolean(errors.email)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </Field>

                            <Button type="submit">Create Account</Button>
                        </>
                    )}
                </Form>
            </section>
        </Layout>
    );
}
