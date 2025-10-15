import { cva, VariantProps } from 'class-variance-authority';
import { CircleAlertIcon } from 'lucide-react';

interface AppPageAlertProps {
    title: string;
    message: string;
}

const alertVariants = cva('mb-4 rounded flex gap-2 items-start border-l-4 p-3 text-sm', {
    variants: {
        variant: {
            default:
                'text-gray-800 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
            info: 'border-blue-300 text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800',
            warning:
                'text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800',
            error: 'text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800',
            success:
                'text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800',
        },
    },
    defaultVariants: { variant: 'default' },
});

export default function AppPageAlert({
    title,
    message,
    variant,
}: Readonly<AppPageAlertProps & VariantProps<typeof alertVariants>>) {
    return (
        <div role="alert" className={alertVariants({ variant })}>
            <CircleAlertIcon aria-hidden size={14} className="mt-[2px] inline shrink-0" />
            <div>
                <strong className="font-semibold">{title}</strong>
                <p className="text-balance">{message}</p>
            </div>
        </div>
    );
}
