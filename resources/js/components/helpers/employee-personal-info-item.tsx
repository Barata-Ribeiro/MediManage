import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import employee_info from '@/routes/employee_info';
import { SharedData } from '@/types';
import { EmployeeInfo } from '@/types/application/employee';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Activity } from 'react';

interface EmployeePersonalInfoItemProps {
    employee: EmployeeInfo;
    dateOfBirth: string;
}

export default function EmployeePersonalInfoItem({ employee, dateOfBirth }: Readonly<EmployeePersonalInfoItemProps>) {
    const { auth } = usePage<SharedData>().props;

    const isNonAdminEmployee = employee.position !== 'System Administrator';
    const isAllowedToList = auth.permissions.includes('employee_info.index');
    const isAllowedToEdit = auth.permissions.includes('employee_info.edit') && isNonAdminEmployee;

    const employeeListLinkRoute = employee_info.index();
    const finalEmployeeListLinkRoute = isAllowedToList ? employeeListLinkRoute : '#';

    const editLinkRoute = employee_info.edit(employee.id);
    const finalEditLinkRoute = isAllowedToEdit ? editLinkRoute : '#';

    const disabledLinkStyles = 'pointer-events-none opacity-50';

    return (
        <Item variant="outline">
            <ItemHeader>
                <HeadingSmall title="Personal Information" description="The personal details of the employee." />
            </ItemHeader>

            <ItemContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <dl
                    aria-labelledby="personal-info"
                    className="grid gap-3 [&>div>dd]:font-mono [&>div>dd]:text-sm [&>div>dt]:text-sm [&>div>dt]:font-semibold [&>div>dt]:text-muted-foreground"
                >
                    <div>
                        <dt>Full name</dt>
                        <dd>{employee.full_name}</dd>
                    </div>

                    <div>
                        <dt>Gender</dt>
                        <dd>{employee.gender}</dd>
                    </div>

                    <div>
                        <dt>Date of birth</dt>
                        <dd>
                            <time dateTime={dateOfBirth}>{format(dateOfBirth, 'PPP')}</time> ({employee.age} years)
                        </dd>
                    </div>

                    <div>
                        <dt>Phone</dt>
                        <dd>
                            <a
                                href={`tel:${employee.phone_number}`}
                                className="underline"
                                aria-label={`Call ${employee.full_name}`}
                            >
                                {employee.phone_number}
                            </a>
                        </dd>
                    </div>

                    <div>
                        <dt>Address</dt>
                        <dd className="text-sm whitespace-pre-line">{employee.address}</dd>
                    </div>
                </dl>

                <Activity mode={employee.position === 'Doctor' ? 'visible' : 'hidden'}>
                    <dl
                        aria-labelledby="doctor-info"
                        className="grid gap-3 [&>div>dd]:font-mono [&>div>dd]:text-sm [&>div>dt]:text-sm [&>div>dt]:font-semibold [&>div>dt]:text-muted-foreground"
                    >
                        <div>
                            <dt>Specialization</dt>
                            <dd>{employee.specialization ?? 'N/A'}</dd>
                        </div>

                        <div>
                            <dt>Registration Number</dt>
                            <dd>{employee.registration_number ?? 'N/A'}</dd>
                        </div>

                        <div>
                            <dt>Registration Origin</dt>
                            <dd>{employee.registration_origin ?? 'N/A'}</dd>
                        </div>

                        <div>
                            <dt>License Number</dt>
                            <dd>{employee.license_number ?? 'N/A'}</dd>
                        </div>

                        <div>
                            <dt>License Expiry Date</dt>
                            <dd>
                                {employee.license_expiry_date
                                    ? format(String(employee.license_expiry_date), 'PPP')
                                    : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </Activity>

                <div className="inline-flex items-center gap-x-2 md:col-span-2">
                    <Button variant="ghost" asChild>
                        <Link
                            href={finalEmployeeListLinkRoute}
                            className={cn(!isAllowedToList && disabledLinkStyles)}
                            prefetch="hover"
                        >
                            List Employees
                        </Link>
                    </Button>

                    <Button asChild>
                        <Link
                            href={finalEditLinkRoute}
                            className={cn(!isAllowedToEdit && disabledLinkStyles)}
                            prefetch="hover"
                        >
                            Edit Employee
                        </Link>
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}
