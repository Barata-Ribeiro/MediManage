import { prescriptionValidation } from '@/actions/App/Http/Controllers/General/PublicController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import Layout from '@/layouts/app/app-public-layout';
import { Head, useForm } from '@inertiajs/react';
import { TicketCheckIcon } from 'lucide-react';
import { FormEvent } from 'react';

export default function Index() {
    const { data, setData, get, resetAndClearErrors, processing, setError, errors } = useForm({
        validation_code: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!data.validation_code) {
            setError('validation_code', 'Validation code is required.');
            return;
        }

        if (data.validation_code.length !== 16) {
            setError('validation_code', 'Validation code must be 16 characters long.');
            return;
        }

        get(prescriptionValidation(data.validation_code).url, {
            forceFormData: true,
            onSuccess: () => resetAndClearErrors(),
        });
    }

    return (
        <Layout>
            <Head title="Validate Prescription">
                <meta
                    name="description"
                    content="Here you can validate prescriptions using the validation code provided by the system upon prescription creation."
                />
            </Head>

            <section
                aria-labelledby="prescription-validation-title"
                aria-describedby="prescription-validation-desc"
                className="relative isolate flex min-h-dvh items-center justify-center"
            >
                <div className="container">
                    <header className="mx-auto max-w-2xl text-center">
                        <h1
                            id="prescription-validation-title"
                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Validate Prescription
                        </h1>
                        <p
                            id="prescription-validation-desc"
                            className="mt-4 text-lg leading-8 text-balance text-gray-600 dark:text-gray-400"
                        >
                            For proper validation, please use the validation code provided by the system when the
                            prescription was created. It can be found in the prescription details.
                        </p>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-10 w-max inert:pointer-events-none inert:opacity-50"
                        inert={processing}
                    >
                        <ButtonGroup>
                            <Input
                                type="text"
                                placeholder="e.g. 2A7W3FY7673137HF"
                                className="w-[26ch]"
                                value={data.validation_code}
                                onChange={(e) => setData('validation_code', e.target.value)}
                                aria-invalid={!!errors.validation_code}
                                required
                                aria-required
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                aria-label="Validate Prescription"
                                title="Validate Prescription"
                            >
                                <TicketCheckIcon aria-hidden />
                            </Button>
                        </ButtonGroup>

                        {errors.validation_code && <InputError message={errors.validation_code} className="mt-2" />}
                    </form>
                </div>
            </section>
        </Layout>
    );
}
