import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';
import { EmployeePaymentsData } from '@/pages/dashboard/manager-dashboard';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
    value: {
        label: 'Employee Payments',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

export default function EmployeePaymentByMonthChart({ chartData }: Readonly<{ chartData: EmployeePaymentsData }>) {
    const { payments_by_month, total_amount_paid, total_payments } = chartData;

    const points = useMemo(() => {
        return payments_by_month.labels
            .map((label, i) => ({
                month: label,
                value: payments_by_month.data[i] ?? 0,
            }))
            .filter((point) => point.value > 0);
    }, [payments_by_month]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Employee Payments by Month</CardTitle>
                <CardDescription>
                    Total Payments: {total_payments}, Total Amount Paid: {formatCurrency(total_amount_paid)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={points}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="value" fill="var(--chart-4)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
