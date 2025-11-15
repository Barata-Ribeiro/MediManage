import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

import InputError from '@/components/input-error';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Readonly<ResetPasswordProps>) {
    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="inert:pointer-events-none inert:opacity-60 inert:grayscale-100"
            >
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full"
                                readOnly
                                aria-invalid={!!errors.email}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    className="mt-1 block w-full"
                                    autoFocus
                                    placeholder="Password"
                                    required
                                    aria-required
                                    aria-invalid={!!errors.password}
                                />
                                <InputGroupAddon align="inline-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InputGroupButton variant="ghost" aria-label="Info" size="icon-xs">
                                                <InfoIcon aria-hidden />
                                            </InputGroupButton>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Password must be at least 8 characters</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </InputGroupAddon>
                            </InputGroup>
                            <InputError message={errors.password} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
                            <Input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder="Confirm password"
                                required
                                aria-required
                                aria-invalid={!!errors.password_confirmation}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </Field>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Reset password
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
