import { cva, VariantProps } from 'class-variance-authority';

interface AppPageAlertProps {
    title: string;
    message: string;
}

const alertVariants = cva('mb-4 rounded border-l-4 p-3 text-sm', {
    variants: {
        variant: {
            default: 'border-primary bg-primary/50 text-primary-foreground',
            info: 'border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
            warning: 'border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
            error: 'border-red-400 bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200',
            success: 'border-green-400 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200',
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
        <p role="alert" className={alertVariants({ variant })}>
            <strong className="block font-semibold">{title}</strong>
            <span>{message}</span>
        </p>
    );
}
