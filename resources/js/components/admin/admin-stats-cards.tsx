import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TotalUsersByRole } from '@/pages/dashboard/admin-dashboard';
import { ComparisonItem } from '@/types';
import { BriefcaseBusinessIcon, ShieldPlusIcon, StethoscopeIcon, UsersIcon } from 'lucide-react';

interface AdminStatsCardsProps {
    users: ComparisonItem;
    usersByRole: TotalUsersByRole;
}

export default function AdminStatsCards({ users, usersByRole }: Readonly<AdminStatsCardsProps>) {
    const getRole = (role: string) =>
        (usersByRole as Record<string, { total: number; percentageChange: number }>)[role] ?? {
            total: 0,
            percentageChange: 0,
        };

    const formatChange = (value?: number | null) =>
        value === null || value === undefined ? '' : `${value > 0 ? '+' : ''}${value}% from last month`;

    const computeStaffTotals = (roles: TotalUsersByRole) => {
        const excluded = new Set(['Patient', 'Super admin']);
        const entries = Object.entries(roles);
        let total = 0;
        let prevSum = 0;

        for (const [role, stats] of entries) {
            if (excluded.has(role)) continue;
            const t = stats?.total ?? 0;
            const pct = stats?.percentageChange ?? 0;
            total += t;
            const factor = 1 + pct / 100;
            const prev = factor === 0 ? 0 : t / factor;
            prevSum += prev;
        }

        const percentageChange = prevSum === 0 ? 0 : Number((((total - prevSum) / prevSum) * 100).toFixed(2));
        return { total, percentageChange };
    };

    const staff = computeStaffTotals(usersByRole);

    const cards = [
        {
            title: 'Total Users',
            icon: <UsersIcon aria-hidden className="size-4 text-muted-foreground" />,
            value: users.total,
            change: users.percentageChange,
        },
        {
            title: 'Total Patients',
            icon: <ShieldPlusIcon aria-hidden className="size-4 text-muted-foreground" />,
            value: getRole('Patient').total,
            change: getRole('Patient').percentageChange,
        },
        {
            title: 'Total Doctors',
            icon: <StethoscopeIcon aria-hidden className="size-4 text-muted-foreground" />,
            value: getRole('Doctor').total,
            change: getRole('Doctor').percentageChange,
        },
        {
            title: 'Total Staff',
            icon: <BriefcaseBusinessIcon aria-hidden className="size-4 text-muted-foreground" />,
            value: staff.total,
            change: staff.percentageChange,
        },
    ];

    return (
        <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ title, icon, value, change }) => (
                <Card className="w-full" key={title}>
                    <CardHeader className="flex flex-row items-center justify-between gap-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                        {icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value ?? ''}</div>
                        <p className="text-xs text-muted-foreground">{formatChange(change)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
