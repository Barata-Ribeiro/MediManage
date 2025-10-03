import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartItem } from '@/types';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface NewPatientsByMonthChartProps {
    chartData: ChartItem;
}

const chartConfig = {
    value: {
        label: 'New Patients',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export default function NewPatientsByMonthChart({ chartData }: Readonly<NewPatientsByMonthChartProps>) {
    const points = useMemo(
        () =>
            chartData.labels.map((label, i) => ({
                month: label,
                value: chartData.data[i] ?? 0,
            })),
        [chartData],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Patients by Month</CardTitle>
                <CardDescription>Number of new patients registered each month.</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart accessibilityLayer data={points} margin={{ left: -35, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => String(value).slice(0, 3)}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                        <Area
                            dataKey="value"
                            type="bump"
                            fill="var(--chart-1)"
                            fillOpacity={0.4}
                            stroke="var(--chart-1)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
