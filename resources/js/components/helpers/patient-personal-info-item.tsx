import HeadingSmall from '@/components/heading-small';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import { PatientInfo } from '@/types/application/patient';
import { format } from 'date-fns';

interface PatientPersonalInfoItemProps {
    patient: Omit<PatientInfo, 'user' | 'medical_record'>;
    dateOfBirth: string;
}

export default function PatientPersonalInfoItem({ patient, dateOfBirth }: Readonly<PatientPersonalInfoItemProps>) {
    return (
        <Item variant="outline">
            <ItemHeader>
                <HeadingSmall title="Personal Information" description="The personal details of the patient." />
            </ItemHeader>

            <ItemContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <dl
                    aria-labelledby="personal-info"
                    className="grid gap-3 [&>div>dd]:font-mono [&>div>dd]:text-sm [&>div>dt]:text-sm [&>div>dt]:font-semibold [&>div>dt]:text-muted-foreground"
                >
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
                        <dd>
                            <a
                                href={`tel:${patient.phone_number}`}
                                className="underline"
                                aria-label={`Call ${patient.full_name}`}
                            >
                                {patient.phone_number}
                            </a>
                        </dd>
                    </div>

                    <div>
                        <dt>Address</dt>
                        <dd className="text-sm whitespace-pre-line">{patient.address ?? 'N/A'}</dd>
                    </div>
                </dl>

                <dl
                    aria-labelledby="insurance-emergency"
                    className="grid gap-3 [&>div>dd]:font-mono [&>div>dd]:text-sm [&>div>dt]:text-sm [&>div>dt]:font-semibold [&>div>dt]:text-muted-foreground"
                >
                    <div>
                        <dt>Insurance company</dt>
                        <dd>{patient.insurance_company ?? 'N/A'}</dd>
                    </div>

                    <div>
                        <dt>Member ID</dt>
                        <dd>{patient.insurance_member_id_number ?? 'N/A'}</dd>
                    </div>

                    <div>
                        <dt>Group number</dt>
                        <dd>{patient.insurance_group_number ?? 'N/A'}</dd>
                    </div>

                    <div>
                        <dt>Policy number</dt>
                        <dd>{patient.insurance_policy_number ?? 'N/A'}</dd>
                    </div>

                    <div>
                        <dt>Emergency contact</dt>
                        <dd>
                            <div>
                                {patient.emergency_contact_name ?? 'N/A'} (
                                {patient.emergency_contact_relationship ?? 'N/A'})
                            </div>
                            <div>
                                {patient.emergency_contact_phone_number ? (
                                    <a
                                        href={`tel:${patient.emergency_contact_phone_number}`}
                                        className="underline"
                                        aria-label={`Call emergency contact ${patient.emergency_contact_name}`}
                                    >
                                        {patient.emergency_contact_phone_number}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </div>
                        </dd>
                    </div>
                </dl>
            </ItemContent>
        </Item>
    );
}
