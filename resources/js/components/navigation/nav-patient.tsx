import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import appointments from '@/routes/appointments';
import { myRecord } from '@/routes/medicalRecords';
import { NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardClockIcon, ClipboardListIcon, PillIcon } from 'lucide-react';

export function NavPatient() {
    const { props, url } = usePage<SharedData>();

    const auth = props.auth;

    const isPatient = auth.roles.includes('Patient') && !!auth.user.patient_info_id;
    if (!isPatient) return null;

    // TODO: Replace placeholder URLs with actual routes when available
    const patientItems: NavItem[] = [
        {
            title: 'My Appointments',
            href: appointments.patient.index(auth.user.patient_info_id!).url,
            icon: ClipboardClockIcon,
        },
        {
            title: 'My Medical Record',
            href: myRecord().url,
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
                {isPatient &&
                    patientItems.map((item) => {
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
