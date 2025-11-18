import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import DropdownMenuCopyButton from '@/components/ui-helpers/dropdown-menu-copy-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, normalizeString } from '@/lib/utils';
import { generatePdf } from '@/routes/invoices';
import { InvoiceWithRelations } from '@/types/application/invoice';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

export const column: ColumnDef<InvoiceWithRelations>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: 'consultation_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Consultation Date" />,
        cell: ({ row }) => format(row.original.consultation_date, 'PPP'),
        enableSorting: true,
    },
    {
        id: 'patient_info.first_name',
        accessorKey: 'patient_info.first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
        cell: ({ row }) => row.original.patient_info.full_name,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({ row }) => formatCurrency(row.original.amount),
        enableSorting: true,
    },
    {
        accessorKey: 'due_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
        cell: ({ row }) => format(row.original.due_date, 'PPP'),
        enableSorting: true,
    },
    {
        accessorKey: 'payment_method',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Method" />,
        cell: ({ row }) => normalizeString(row.original.payment_method),
        enableSorting: true,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const variant = row.original.status === 'paid' ? 'default' : 'destructive';
            return (
                <Badge variant={variant} className="select-none">
                    {normalizeString(row.original.status)}
                </Badge>
            );
        },
        enableSorting: true,
    },

    {
        id: 'actions',
        cell: function Cell({ row }) {
            const notes = row.original.notes;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <DropdownMenuCopyButton content={notes}>Copy Notes</DropdownMenuCopyButton>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={generatePdf(row.original.id).url} target="_blank" rel="external">
                                Generate PDF
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        size: 40,
    },
];
