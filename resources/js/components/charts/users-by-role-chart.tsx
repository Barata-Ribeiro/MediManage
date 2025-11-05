import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartItem } from '@/types';
import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface UsersByRoleChartProps {
    total: number;
    chartData: ChartItem;
}

const PieLabel = ({ viewBox, totalUsers }: { viewBox?: unknown; totalUsers: number }) => {
    if (viewBox && typeof viewBox === 'object' && viewBox !== null && 'cx' in viewBox && 'cy' in viewBox) {
        const { cx, cy } = viewBox as { cx: number; cy: number };

        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
                    {totalUsers}
                </tspan>

                <tspan x={cx} y={cy + 24} className="fill-muted-foreground">
                    Total
                </tspan>
            </text>
        );
    }

    return null;
};

export default function UsersByRoleChart({ total, chartData }: Readonly<UsersByRoleChartProps>) {
    const normalizeKey = (s: string) => s.toLowerCase().replaceAll(/\s+/g, '_');

    const transformedData = useMemo(() => {
        return chartData.labels.map((label, i) => ({
            role: normalizeKey(label),
            total: chartData.data[i] ?? 0,
            fill: `var(--chart-${(i % 6) + 1})`,
        }));
    }, [chartData]);

    const chartConfig = useMemo(() => {
        const cfg: Record<string, { label: string; color?: string }> = {
            total: { label: 'Total Users' },
        };

        for (const [i, label] of chartData.labels.entries()) {
            cfg[normalizeKey(label)] = { label, color: `var(--chart-${(i % 6) + 1})` };
        }

        return cfg;
    }, [chartData]) satisfies ChartConfig;

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="pb-0">
                <CardTitle>Users By Role</CardTitle>
                <CardDescription>Number of users by role in the system</CardDescription>
            </CardHeader>

            <CardContent className="max-h-116 flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                    <PieChart accessibilityLayer>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={transformedData} dataKey="total" nameKey="role" innerRadius={60} strokeWidth={5}>
                            <Label content={<PieLabel totalUsers={total} />} />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="role" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
