import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import appointments from '@/routes/appointments';
import { createPartial, search } from '@/routes/patient_info';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarPlusIcon, UserPlusIcon, UserSearchIcon } from 'lucide-react';

export default function NavAttendant() {
    const { props, url } = usePage<SharedData>();
    const auth = props.auth;

    const isAttendant = auth.roles.includes('Attendant');
    if (!isAttendant || !auth.user.employee_info_id) return null;

    const attendantItems: NavItem[] = [
        {
            title: 'Schedule Appointment',
            href: appointments.create().url,
            icon: CalendarPlusIcon,
        },
        {
            title: 'New Patient',
            href: createPartial().url,
            icon: UserPlusIcon,
        },
        {
            title: 'Find Patient',
            href: search().url,
            icon: UserSearchIcon,
        },
    ];

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Attendant</SidebarGroupLabel>
            <SidebarMenu>
                {attendantItems.map((item) => {
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
