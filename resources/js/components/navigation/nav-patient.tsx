import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardClockIcon, ClipboardListIcon, PillIcon } from 'lucide-react';

export function NavPatient() {
    const { props, url } = usePage<SharedData>();

    const auth = props.auth;

    // TODO: Check for 'patient_info_id' when route for user to register a patient info is available
    const isPatient = auth.roles.includes('Patient');
    if (!isPatient) return null;

    // TODO: Replace placeholder URLs with actual routes when available
    const patientItems: NavItem[] = [
        {
            title: 'My Appointments',
            href: 'placeholder_for_appointments_url',
            icon: ClipboardClockIcon,
        },
        {
            title: 'My Medical Record',
            href: 'placeholder_for_medical_records_url',
            icon: ClipboardListIcon,
        },
        {
            title: 'My Prescriptions',
            href: 'placeholder_for_prescriptions_url',
            icon: PillIcon,
        },
    ];

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Patient</SidebarGroupLabel>
            <SidebarMenu>
                {patientItems.map((item) => {
                    const urlWithoutQuery = url.split('?')[0];
                    const endingPath = typeof item.href === 'string' ? item.href : item.href.url;
                    const isActive = urlWithoutQuery.endsWith(endingPath);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
