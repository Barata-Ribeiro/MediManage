import NoAccount from '@/components/helpers/no-account';
import NoMedicalRecord from '@/components/helpers/no-medical-record';
import PatientAccountInfoItem from '@/components/helpers/patient-account-info-item';
import PatientMedicalRecordInfoItem from '@/components/helpers/patient-medical-record-info-item';
import PatientPersonalInfoItem from '@/components/helpers/patient-personal-info-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent } from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app-layout';
import patient_info from '@/routes/patient_info';
import { BreadcrumbItem } from '@/types';
import { PatientInfo } from '@/types/application/patient';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { CakeIcon, MailIcon, PhoneIcon } from 'lucide-react';

export default function Show({ patient: data }: Readonly<{ patient: PatientInfo }>) {
    const getInitials = useInitials();
    const { user, medical_record, ...rest } = data;

    const hasAccount = !!user;
    const hasMedicalRecord = !!medical_record;
    const dateOfBirth = String(rest?.date_of_birth).replaceAll('-', '/');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Patient Details',
            href: patient_info.show(data.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={rest.full_name} />

            <article className="container py-2">
                <header className="flex items-center gap-4 rounded-lg border p-6">
                    <Avatar className="size-22">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-2xl">{getInitials(rest.full_name!)}</AvatarFallback>
                    </Avatar>

                    <div className="grid gap-2">
                        <h1 className="inline-flex items-center gap-2 text-2xl font-bold">
                            {rest.full_name} {!hasAccount && <Badge variant="destructive">No Account</Badge>}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-x-1">
                            <span>
                                <MailIcon size={16} aria-hidden /> {user?.email ?? 'N/A'}
                            </span>
                            <span>
                                <PhoneIcon size={16} aria-hidden /> {rest.phone_number ?? 'N/A'}
                            </span>
                            <span>
                                <CakeIcon size={16} aria-hidden /> {format(dateOfBirth, 'PPP')} ({rest.age} years)
                            </span>
                        </div>
                    </div>
                </header>

                <div id="tabs">
                    <Tabs defaultValue="personal" className="py-4">
                        <TabsList>
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="medicalRecord">Medical Record</TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal">
                            <PatientPersonalInfoItem patient={rest} dateOfBirth={dateOfBirth} />
                        </TabsContent>

                        <TabsContent value="account">
                            {hasAccount ? (
                                <PatientAccountInfoItem account={user} />
                            ) : (
                                <Item variant="outline">
                                    <ItemContent>
                                        <NoAccount id={rest.id} />
                                    </ItemContent>
                                </Item>
                            )}
                        </TabsContent>

                        <TabsContent value="medicalRecord">
                            {hasMedicalRecord ? (
                                <PatientMedicalRecordInfoItem medicalRecord={medical_record} />
                            ) : (
                                <Item variant="outline">
                                    <ItemContent>
                                        <NoMedicalRecord />
                                    </ItemContent>
                                </Item>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </article>
        </Layout>
    );
}
