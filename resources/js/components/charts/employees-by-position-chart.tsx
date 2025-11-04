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
import { Label, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

const PieLabel = ({ viewBox, totalEmployees }: { viewBox?: unknown; totalEmployees: number }) => {
    if (viewBox && typeof viewBox === 'object' && viewBox !== null && 'cx' in viewBox && 'cy' in viewBox) {
        const { cx, cy } = viewBox as { cx: number; cy: number };

        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
                    {totalEmployees}
                </tspan>

                <tspan x={cx} y={cy + 24} className="fill-muted-foreground">
                    Total
                </tspan>
            </text>
        );
    }

    return null;
};

const ActiveShape = ({ outerRadius = 0, ...props }: PieSectorDataItem) => (
    <g>
        <Sector {...props} outerRadius={outerRadius + 10} />
        <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
    </g>
);

export default function EmployeesByPositionChart({ chartData }: Readonly<{ chartData: ChartItem }>) {
    const normalizeKey = (s: string) => s.toLowerCase().replaceAll(/\s+/g, '_');

    const transformedData = useMemo(() => {
        return chartData.labels.map((label, i) => ({
            position: normalizeKey(label),
            total: chartData.data[i] ?? 0,
            fill: `var(--chart-${(i % 6) + 1})`,
        }));
    }, [chartData]);

    const chartConfig = useMemo(() => {
        const cfg: Record<string, { label: string; color?: string }> = {
            total: { label: 'Total Employees' },
        };

        for (const [i, label] of chartData.labels.entries()) {
            cfg[normalizeKey(label)] = { label, color: `var(--chart-${(i % 6) + 1})` };
        }

        return cfg;
    }, [chartData]) satisfies ChartConfig;

    const totalEmployees = chartData.data.reduce((sum, val) => sum + val, 0);

    const activeIndex = useMemo(
        () => transformedData.findIndex((entry) => entry.position === 'manager'),
        [transformedData],
    );

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="pb-0">
                <CardTitle>Employees by Position</CardTitle>
                <CardDescription>Number of employees categorized by their job positions.</CardDescription>
            </CardHeader>

            <CardContent className="max-h-90 flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                    <PieChart accessibilityLayer>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={transformedData}
                            dataKey="total"
                            nameKey="position"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={<ActiveShape />}
                        >
                            <Label content={<PieLabel totalEmployees={totalEmployees} />} />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="position" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
