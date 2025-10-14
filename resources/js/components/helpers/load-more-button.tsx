import Loading from '@/components/helpers/loading';
import { Button } from '@/components/ui/button';

interface InfiniteScrollNextProps {
    hasMore: boolean;
    loading: boolean;
    fetch: () => void;
}

function LoadMoreButton({ hasMore, loading, fetch }: Readonly<InfiniteScrollNextProps>) {
    if (!hasMore) return null;

    return (
        <Button type="button" disabled={loading} onClick={fetch} className="mt-2 w-full">
            {loading ? <Loading /> : 'Load More'}
        </Button>
    );
}

export default function renderLoadMore(props: Readonly<InfiniteScrollNextProps>) {
    return <LoadMoreButton {...props} />;
}
