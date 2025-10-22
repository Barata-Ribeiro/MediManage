import { Skeleton } from '@/components/ui/skeleton';

export default function RelatedArticleSkeleton() {
    return (
        <div className="group grid grid-cols-1 gap-2">
            <div className="relative min-h-48">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="absolute top-2 left-2 h-6 w-20 rounded-br-lg" />
            </div>

            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
        </div>
    );
}
