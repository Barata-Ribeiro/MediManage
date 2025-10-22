import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartItem } from '@/types';
import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface UsersByRoleChartProps {
    total: number;
    chartData: ChartItem;
}

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

            <CardContent className="max-h-[22.5rem] flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                    <PieChart accessibilityLayer>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={transformedData} dataKey="total" nameKey="role" innerRadius={60} strokeWidth={5}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {total}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center-safe justify-center-safe gap-4">
                {transformedData.map((entry) => (
                    <div key={entry.role} className="flex items-center gap-2">
                        <span
                            className="inline-block size-3 flex-shrink-0 rounded-sm"
                            style={{ backgroundColor: entry.fill }}
                        />
                        <div className="text-sm">
                            <span className="font-semibold">{chartConfig[entry.role]?.label}:</span> {entry.total}
                        </div>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
}
