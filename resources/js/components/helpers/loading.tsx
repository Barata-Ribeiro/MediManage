import { Spinner } from '@/components/ui/spinner';
import { Fragment } from 'react';

export default function Loading() {
    return (
        <Fragment>
            <Spinner />
            Loading...
        </Fragment>
    );
}
