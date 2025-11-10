import { formatCurrency, normalizeString } from '@/lib/utils';
import { Contract } from '@/types/application/contract';
import { ContractType } from '@/types/application/enums';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ContractProgressBar from './contract-progress-bar';

const getContractTypeBadgeVariant = (type: ContractType) => {
    switch (type) {
        case ContractType.FullTime:
            return 'default';
        case ContractType.PartTime:
            return 'secondary';
        case ContractType.Contractor:
        case ContractType.Intern:
            return 'outline';
        default:
            return 'secondary';
    }
};

export default function ContractItemListItem({ contract }: Readonly<{ contract: Contract }>) {
    return (
        <Card role="listitem">
            <CardHeader>
                <div className="items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-lg">Contract #{contract.id}</CardTitle>
                        <Badge variant={getContractTypeBadgeVariant(contract.contract_type)} className="select-none">
                            {normalizeString(contract.contract_type)}
                        </Badge>
                    </div>

                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Rate</p>
                        <p className="text-lg font-bold">
                            {formatCurrency(contract.rate)}{' '}
                            <span className="text-sm text-muted-foreground">/{contract.rate_type}</span>
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                    <span>{format(contract.start_date, 'PPP')}</span>
                    <span>{format(contract.end_date, 'PPP')}</span>
                </div>
                <ContractProgressBar startDate={String(contract.start_date)} endDate={String(contract.end_date)} />
            </CardContent>
        </Card>
    );
}
