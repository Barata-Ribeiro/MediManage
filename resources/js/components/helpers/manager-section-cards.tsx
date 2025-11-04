import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { InvoicesData, TotalPatients } from '@/pages/dashboard/manager-dashboard';
import { BanknoteArrowDownIcon, CheckCircleIcon, ClipboardClockIcon, TrendingUpDownIcon } from 'lucide-react';

interface ManagerSectionCardsProps {
    invoiceData: InvoicesData;
    totalPatients: TotalPatients;
}

export default function ManagerSectionCards({ invoiceData, totalPatients }: Readonly<ManagerSectionCardsProps>) {
    return (
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Invoices</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {invoiceData.total_invoices}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="select-none">
                            <ClipboardClockIcon aria-hidden />
                            {invoiceData.pending_invoices} Pending
                        </Badge>
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Paid Invoices</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {invoiceData.paid_invoices}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="select-none">
                            <CheckCircleIcon aria-hidden />
                            {Math.round((invoiceData.paid_invoices / invoiceData.total_invoices) * 100)}% Paid
                        </Badge>
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Amount</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {formatCurrency(invoiceData.total_amount)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="select-none">
                            <BanknoteArrowDownIcon aria-hidden />
                            {formatCurrency(invoiceData.pending_amount)} Pending
                        </Badge>
                    </CardAction>
                </CardHeader>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>New Patients</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalPatients.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUpDownIcon />
                            {totalPatients.percentage_change}%
                        </Badge>
                    </CardAction>
                </CardHeader>
            </Card>
        </div>
    );
}
