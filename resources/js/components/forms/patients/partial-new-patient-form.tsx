import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react';

interface PartialNewPatientFormProps {
    errors: Record<string, string>;
    date: Date | null;
    onChange: Dispatch<SetStateAction<Date | null>>;
}

export default function PartialNewPatientForm({ errors, date, onChange }: Readonly<PartialNewPatientFormProps>) {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <h3 className="text-lg leading-6 font-bold underline underline-offset-2">Patient Information</h3>

            <FieldSet className="rounded-lg border bg-background p-4">
                <FieldLegend className="px-1 font-semibold">Name</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                        <Input
                            id="first_name"
                            name="first_name"
                            type="text"
                            placeholder="e.g. Jason"
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
                            placeholder="e.g. Bourne"
                            aria-invalid={Boolean(errors.last_name)}
                            required
                            aria-required
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet className="rounded-lg border bg-background p-4">
                <FieldLegend className="px-1 font-semibold">Personal Details</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>
                        <Input
                            id="gender"
                            name="gender"
                            type="text"
                            placeholder="e.g. Male"
                            aria-invalid={Boolean(errors.gender)}
                            required
                            aria-required
                        />
                        <InputError message={errors.gender} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                    {date ? date.toLocaleDateString() : 'Select date'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date ?? undefined}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        onChange(date ?? null);
                                        setOpen(false);
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
                            placeholder="e.g. +1 123 456 7890"
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
                            placeholder="e.g. 123 Main St, City, State"
                            aria-invalid={Boolean(errors.address)}
                            required
                            aria-required
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet className="rounded-lg border bg-background p-4">
                <FieldLegend className="px-1 font-semibold">Insurance Information</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="insurance_company">Insurance Company</FieldLabel>
                        <Input
                            id="insurance_company"
                            name="insurance_company"
                            type="text"
                            placeholder="e.g. Blue Cross"
                            aria-invalid={Boolean(errors.insurance_company)}
                            required
                            aria-required
                        />
                        <InputError message={errors.insurance_company} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="insurance_member_id_number">Member ID Number</FieldLabel>
                        <Input
                            id="insurance_member_id_number"
                            name="insurance_member_id_number"
                            type="text"
                            placeholder="e.g. 123456789"
                            aria-invalid={Boolean(errors.insurance_member_id_number)}
                            required
                            aria-required
                        />
                        <InputError message={errors.insurance_member_id_number} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="insurance_group_number">Group Number</FieldLabel>
                        <Input
                            id="insurance_group_number"
                            name="insurance_group_number"
                            type="text"
                            placeholder="e.g. GRP123"
                            aria-invalid={Boolean(errors.insurance_group_number)}
                            required
                            aria-required
                        />
                        <InputError message={errors.insurance_group_number} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="insurance_policy_number">Policy Number</FieldLabel>
                        <Input
                            id="insurance_policy_number"
                            name="insurance_policy_number"
                            type="text"
                            placeholder="e.g. POL987654"
                            aria-invalid={Boolean(errors.insurance_policy_number)}
                            required
                            aria-required
                        />
                        <InputError message={errors.insurance_policy_number} className="mt-2" />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet className="rounded-lg border bg-background p-4">
                <FieldLegend className="px-1 font-semibold">Emergency Contact (Optional)</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="emergency_contact_name">Emergency Contact Name</FieldLabel>
                        <Input
                            id="emergency_contact_name"
                            name="emergency_contact_name"
                            type="text"
                            placeholder="e.g. John Doe"
                            aria-invalid={Boolean(errors.emergency_contact_name)}
                        />
                        <InputError message={errors.emergency_contact_name} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="emergency_contact_relationship">Relationship</FieldLabel>
                        <Input
                            id="emergency_contact_relationship"
                            name="emergency_contact_relationship"
                            type="text"
                            placeholder="e.g. Spouse"
                            aria-invalid={Boolean(errors.emergency_contact_relationship)}
                        />
                        <InputError message={errors.emergency_contact_relationship} className="mt-2" />
                    </Field>
                    <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="emergency_contact_phone_number">Emergency Contact Phone Number</FieldLabel>
                        <Input
                            id="emergency_contact_phone_number"
                            name="emergency_contact_phone_number"
                            type="tel"
                            placeholder="e.g. +1 123 456 7890"
                            aria-invalid={Boolean(errors.emergency_contact_phone_number)}
                        />
                        <InputError message={errors.emergency_contact_phone_number} className="mt-2" />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet className="rounded-lg border bg-background p-4">
                <FieldLegend className="px-1 font-semibold">Medical History (Optional)</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="current_medications">Current Medications</FieldLabel>
                        <Input
                            id="current_medications"
                            name="current_medications"
                            type="text"
                            placeholder="e.g. Aspirin, Insulin"
                            aria-invalid={Boolean(errors.current_medications)}
                        />
                        <InputError message={errors.current_medications} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="past_illnesses">Past Illnesses</FieldLabel>
                        <Input
                            id="past_illnesses"
                            name="past_illnesses"
                            type="text"
                            placeholder="e.g. Diabetes, Hypertension"
                            aria-invalid={Boolean(errors.past_illnesses)}
                        />
                        <InputError message={errors.past_illnesses} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="surgeries">Surgeries</FieldLabel>
                        <Input
                            id="surgeries"
                            name="surgeries"
                            type="text"
                            placeholder="e.g. Appendectomy, Knee Replacement"
                            aria-invalid={Boolean(errors.surgeries)}
                        />
                        <InputError message={errors.surgeries} className="mt-2" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="family_medical_history">Family Medical History</FieldLabel>
                        <Input
                            id="family_medical_history"
                            name="family_medical_history"
                            type="text"
                            placeholder="e.g. Heart disease, Cancer"
                            aria-invalid={Boolean(errors.family_medical_history)}
                        />
                        <InputError message={errors.family_medical_history} className="mt-2" />
                    </Field>
                </FieldGroup>
            </FieldSet>
        </Fragment>
    );
}
