import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartItem } from '@/types';
import { useMemo } from 'react';
import { LabelList, Pie, PieChart } from 'recharts';

interface AppointmentsGenderOverviewChartProps {
    chartData: ChartItem;
}

export default function AppointmentsGenderOverviewChart({ chartData }: Readonly<AppointmentsGenderOverviewChartProps>) {
    const chartConfig = useMemo(() => {
        const cfg: Record<string, { label: string; color?: string }> = {};

        for (const [i, label] of chartData.labels.entries()) {
            cfg[label] = { label, color: `var(--chart-${(i % 5) + 1})` };
        }
        return cfg;
    }, [chartData]) satisfies ChartConfig;

    const pieData = useMemo(
        () =>
            chartData.labels.map((label, i) => ({
                gender: label,
                value: chartData.data[i] ?? 0,
                fill: chartConfig[label]?.color ?? undefined,
            })),
        [chartData, chartConfig],
    );

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="pb-0">
                <CardTitle>Appointment By Gender</CardTitle>
                <CardDescription>Overview of appointments distribution by patient&apos;s gender.</CardDescription>
            </CardHeader>

            <CardContent className="max-h-[16rem] flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="gender" className="bg-accent" hideLabel />}
                        />
                        <Pie data={pieData} dataKey="value" label nameKey="gender">
                            <LabelList
                                dataKey="gender"
                                className="fill-background font-semibold"
                                stroke="none"
                                fontSize={14}
                                formatter={(value) => `${value}`}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
