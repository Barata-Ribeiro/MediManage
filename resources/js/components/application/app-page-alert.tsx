import { cva, VariantProps } from 'class-variance-authority';
import { CircleAlertIcon } from 'lucide-react';

interface AppPageAlertProps {
    title: string;
    message: string;
}

const alertVariants = cva('mb-4 flex items-start gap-2 rounded border-l-4 p-3 text-sm', {
    variants: {
        variant: {
            default:
                'border-gray-300 bg-gray-50 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
            info: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400',
            warning:
                'border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-gray-800 dark:text-yellow-300',
            error: 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400',
            success:
                'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-gray-800 dark:text-green-400',
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
            <CircleAlertIcon aria-hidden size={14} className="mt-0.5 inline shrink-0" />
            <div>
                <strong className="font-semibold">{title}</strong>
                <p className="text-balance">{message}</p>
            </div>
        </div>
    );
}
