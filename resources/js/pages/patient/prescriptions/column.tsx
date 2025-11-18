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
import prescriptions from '@/routes/prescriptions';
import { TablePrescription } from '@/types/application/prescription';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeCheckIcon, CircleAlertIcon, MoreHorizontal } from 'lucide-react';

export const patientColumn: ColumnDef<TablePrescription>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: 'employee_info.first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
        cell: ({ row }) => row.original.employee_info.full_name,
        enableSorting: true,
    },
    {
        accessorKey: 'employee_info.specialization',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Specialization" />,
        cell: ({ row }) => row.original.employee_info.specialization,
        enableSorting: true,
    },
    {
        accessorKey: 'date_issued',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Issued At" />,
        cell: ({ row }) => {
            const dateIssued = String(row.original.date_issued).replaceAll('-', '/');
            return format(dateIssued, 'PPP');
        },
        enableSorting: true,
    },
    {
        accessorKey: 'date_expires',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expires At" />,
        cell: ({ row }) => {
            const dateExpires = String(row.original.date_expires).replaceAll('-', '/');
            return format(dateExpires, 'PPP');
        },
        enableSorting: true,
    },
    {
        accessorKey: 'is_valid',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Is Valid" />,
        cell: ({ row }) => {
            const isValid = row.original.is_valid;

            return isValid ? (
                <Badge className="select-none" variant="secondary">
                    <BadgeCheckIcon aria-hidden />
                    Valid
                </Badge>
            ) : (
                <Badge className="select-none" variant="destructive">
                    <CircleAlertIcon aria-hidden />
                    Expired
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
        cell: ({ row }) => format(row.original.updated_at, 'PPpp'),
        enableSorting: true,
    },

    {
        id: 'actions',
        cell: function Cell({ row }) {
            const doctor = row.original.employee_info;

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
                            <DropdownMenuCopyButton content={doctor.full_name}>Copy Doctor Name</DropdownMenuCopyButton>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DropdownMenuCopyButton content={doctor.specialization}>
                                Copy Specialization
                            </DropdownMenuCopyButton>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={prescriptions.generatePdf(row.original.id).url} target="_blank" rel="external">
                                Get PDF
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
