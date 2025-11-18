import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import { Activity, HTMLAttributes } from 'react';

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    const columnSortDir = column.getIsSorted();

    const columnSortIndicator = {
        asc: <ArrowUp aria-hidden />,
        desc: <ArrowDown aria-hidden />,
        default: <ChevronsUpDown aria-hidden />,
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                        <span>{title}</span>
                        {columnSortDir ? columnSortIndicator[columnSortDir] : columnSortIndicator['default']}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        {columnSortIndicator['asc']}
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        {columnSortIndicator['desc']}
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.clearSorting()}>
                        {columnSortIndicator['default']}
                        Clear
                    </DropdownMenuItem>
                    <Activity mode={column.getCanHide() ? 'visible' : 'hidden'}>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                            <EyeOff />
                            Hide
                        </DropdownMenuItem>
                    </Activity>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
