import { Progress } from '@/components/ui/progress';
import { formatDistanceToNowStrict } from 'date-fns';

interface ContractProgressBarProps {
    startDate: string;
    endDate: string;
}

export default function ContractProgressBar({ startDate, endDate }: Readonly<ContractProgressBarProps>) {
    const startMs = Date.parse(startDate);
    const endMs = Date.parse(endDate);
    const now = Date.now();

    // Guard: if dates are invalid or duration is zero/negative, show empty progress
    if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
        return (
            <div className="space-y-2">
                <Progress value={0} className="transition-all" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not Available</span>
                    <span>Invalid contract dates</span>
                </div>
            </div>
        );
    }

    const total = endMs - startMs;
    const elapsed = Math.max(0, Math.min(now - startMs, total));
    const percent = Math.round((elapsed / total) * 100);

    const isCompleted = now > endMs;
    const isActive = now >= startMs && now <= endMs;

    let displayValue: number;
    if (isCompleted) displayValue = 100;
    else if (isActive) displayValue = percent;
    else displayValue = 0;

    let statusText: string;
    if (isCompleted) statusText = 'Completed';
    else if (isActive) statusText = `${percent}% Complete`;
    else statusText = 'Not Started';

    let detailText: string;
    if (isCompleted) detailText = `Ended ${formatDistanceToNowStrict(endMs, { addSuffix: true })}`;
    else if (isActive) detailText = `Ends ${formatDistanceToNowStrict(endMs, { addSuffix: true })}`;
    else detailText = `Not Started - Starts in ${formatDistanceToNowStrict(startMs, { addSuffix: true })}`;

    return (
        <div className="space-y-2">
            <Progress value={displayValue} className="transition-all" />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{statusText}</span>
                <span>{detailText}</span>
            </div>
        </div>
    );
}
