import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { normalizeString } from '@/lib/utils';
import { ChartItem } from '@/types';
import { useMemo } from 'react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

interface AppointmentsStatusOverviewChartProps {
    chartData: ChartItem;
}

export default function AppointmentsStatusOverviewChart({ chartData }: Readonly<AppointmentsStatusOverviewChartProps>) {
    const chartConfig = useMemo(() => {
        const cfg: Record<string, { label: string; color?: string }> = {};

        for (const [i, label] of chartData.labels.entries()) {
            const key = normalizeString(label); // use normalized key for both dataKey and display label
            cfg[key] = { label: key, color: `var(--chart-${(i % 6) + 1})` };
        }
        return cfg;
    }, [chartData]) satisfies ChartConfig;

    const transformedData = useMemo(() => {
        const row: Record<string, number | string> = { name: 'appointments' };
        for (const [i, label] of chartData.labels.entries()) {
            const key = normalizeString(label);
            row[key] = chartData.data[i] ?? 0;
        }
        return [row];
    }, [chartData]);

    const total = useMemo(() => chartData.data.reduce((s, v) => s + v, 0), [chartData]);

    return (
        <Card>
            <CardHeader className="pb-0">
                <CardTitle>Appointments By Status</CardTitle>
                <CardDescription>Overview of appointments distribution by their status.</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-52 pb-0 sm:mt-8">
                    <RadialBarChart data={transformedData} endAngle={180} innerRadius={80} outerRadius={130}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {total.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    Appointments
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>

                        {Object.entries(chartConfig).map(([key, cfg]) => (
                            <RadialBar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                cornerRadius={5}
                                fill={cfg.color}
                                className="stroke-transparent stroke-2"
                            />
                        ))}
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
