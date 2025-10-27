import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarSkeleton() {
    return (
        <Skeleton aria-label="Loading in process..." className="h-96 max-w-2xl p-4">
            <div className="flex size-full flex-col gap-4 md:flex-row">
                <Skeleton className="md:w-2/3" />
                <Skeleton className="md:w-1/3" />
            </div>
        </Skeleton>
    );
}
