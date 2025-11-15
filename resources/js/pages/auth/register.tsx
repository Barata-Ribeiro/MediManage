import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AuthLayout from '@/layouts/auth-layout';
import { HelpCircle, InfoIcon } from 'lucide-react';

export default function Register() {
    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6 inert:pointer-events-none inert:opacity-60 inert:grayscale-100"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Full name"
                                    required
                                    aria-required
                                    aria-invalid={!!errors.name}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email address</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        type="email"
                                        id="email"
                                        name="email"
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        required
                                        aria-required
                                        aria-invalid={!!errors.email}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
                                                    <HelpCircle aria-hidden />
                                                </InputGroupButton>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>We&apos;ll use this to send you account related emails.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </InputGroupAddon>
                                </InputGroup>
                                <InputError message={errors.email} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        type="password"
                                        id="password"
                                        name="password"
                                        tabIndex={3}
                                        autoComplete="new-password"
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
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    required
                                    aria-required
                                    aria-invalid={!!errors.password_confirmation}
                                />
                                <InputError message={errors.password_confirmation} />
                            </Field>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5} data-test="register-user-button">
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
