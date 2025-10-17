import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { normalizeString } from '@/lib/utils';
import { ChartItem } from '@/types';
import { useMemo } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

interface AppointmentsStatusOverviewChartProps {
    chartData: ChartItem;
}

export default function AppointmentsStatusOverviewChart({ chartData }: Readonly<AppointmentsStatusOverviewChartProps>) {
    const chartConfig = useMemo(() => {
        const cfg: Record<string, { label: string; color?: string }> = {};

        for (const [i, label] of chartData.labels.entries()) {
            const key = normalizeString(label);
            cfg[key] = { label: key, color: `var(--chart-${(i % 6) + 1})` };
        }
        return cfg;
    }, [chartData]) satisfies ChartConfig;

    const transformedData = useMemo(() => {
        return chartData.labels
            .map((label, i) => {
                const key = normalizeString(label);
                const appointments = chartData.data[i] ?? 0;
                return { status: label, appointments, fill: chartConfig[key]?.color };
            })
            .filter((item) => (item.appointments ?? 0) > 0);
    }, [chartData, chartConfig]);

    return (
        <Card>
            <CardHeader className="pb-0">
                <CardTitle>Appointments By Status</CardTitle>
                <CardDescription>Overview of appointments distribution by their status.</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={transformedData} layout="vertical">
                        <YAxis
                            dataKey="status"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => chartConfig[normalizeString(String(value))]?.label}
                            hide
                        />
                        <XAxis dataKey="appointments" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="appointments" radius={5}>
                            <LabelList
                                dataKey="status"
                                position="insideLeft"
                                offset={8}
                                className="fill-white"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="appointments"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
