import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { normalizeString } from '@/lib/utils';
import { ContractsData } from '@/pages/dashboard/manager-dashboard';
import { useMemo } from 'react';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

const RadialLabel = ({ viewBox, totalContracts }: { viewBox?: unknown; totalContracts: number }) => {
    if (viewBox && typeof viewBox === 'object' && viewBox !== null && 'cx' in viewBox && 'cy' in viewBox) {
        const { cx, cy } = viewBox as { cx: number; cy: number };

        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={cx} y={cy} className="fill-foreground text-4xl font-bold">
                    {totalContracts.toLocaleString()}
                </tspan>

                <tspan x={cx} y={cy + 24} className="fill-muted-foreground">
                    Total Contracts
                </tspan>
            </text>
        );
    }

    return null;
};

export default function ContractByTypeChart({
    total_contracts,
    active_contracts,
    contracts_by_type,
}: Readonly<ContractsData>) {
    const chartConfig = useMemo(() => {
        const cfg: Record<string, { label: string; color?: string }> = {};

        for (const [i, label] of contracts_by_type.labels.entries()) {
            const key = normalizeString(label);
            cfg[key] = { label: key, color: `var(--chart-${(i % 5) + 1})` };
        }

        return cfg;
    }, [contracts_by_type]) satisfies ChartConfig;

    const radialData = useMemo(() => {
        return contracts_by_type.labels.map((label, i) => ({
            type: normalizeString(label),
            contracts: contracts_by_type.data[i] ?? 0,
            fill: chartConfig[normalizeString(label)]?.color ?? undefined,
        }));
    }, [contracts_by_type, chartConfig]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Contracts by Type (Active: {active_contracts.toLocaleString()})</CardTitle>
                <CardDescription>Distribution of contracts categorized by their types.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-90 flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                    <RadialBarChart data={radialData} endAngle={100} innerRadius={80} outerRadius={140}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="contracts" background />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label content={<RadialLabel totalContracts={total_contracts} />} />
                        </PolarRadiusAxis>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="type" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
