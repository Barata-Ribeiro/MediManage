import { DataTableColumnHeader } from '@/components/data-table-column-header';
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
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeCheckIcon, CircleAlertIcon, MoreHorizontal } from 'lucide-react';

export const column: ColumnDef<TablePrescription>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        id: 'patient_info.first_name',
        accessorKey: 'patient_info.first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: 'patient_info.last_name',
        accessorKey: 'patient_info.last_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'date_issued',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Issued At" />,
        cell: ({ row }) => format(row.original.date_issued, 'PPpp'),
        enableSorting: true,
    },
    {
        accessorKey: 'date_expires',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expires At" />,
        cell: ({ row }) => format(row.original.date_expires, 'PPpp'),
        enableSorting: true,
    },
    {
        accessorKey: 'is_valid',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Is Valid" />,
        cell: ({ row }) => {
            const isValid = row.original.is_valid;

            return isValid ? (
                <Badge variant="secondary">
                    <BadgeCheckIcon aria-hiden />
                    Valid
                </Badge>
            ) : (
                <Badge variant="destructive">
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
        cell: ({ row }) => {
            const patient = row.original.patient_info;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <DropdownMenuCopyButton content={patient.full_name}>Copy Full Name</DropdownMenuCopyButton>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                className="w-full"
                                href={prescriptions.show({
                                    doctor: row.original.employee_info_id,
                                    patientInfo: patient.id,
                                    prescription: row.original.id,
                                })}
                                as="button"
                            >
                                Show
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
