import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

function ItemGroup({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            role="list"
            data-slot="item-group"
            className={cn('group/item-group flex flex-col', className)}
            {...props}
        />
    );
}

function ItemSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
    return (
        <Separator data-slot="item-separator" orientation="horizontal" className={cn('my-0', className)} {...props} />
    );
}

const itemVariants = cva(
    'group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline: 'border-border',
                muted: 'bg-muted/50',
            },
            size: {
                default: 'p-4 gap-4 ',
                sm: 'py-3 px-4 gap-2.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Item({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: ComponentProps<'div'> & VariantProps<typeof itemVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'div';
    return (
        <Comp
            data-slot="item"
            data-variant={variant}
            data-size={size}
            className={cn(itemVariants({ variant, size, className }))}
            {...props}
        />
    );
}

const itemMediaVariants = cva(
    'flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none group-has-data-[slot=item-description]/item:translate-y-0.5',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
                image: 'size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function ItemMedia({
    className,
    variant = 'default',
    ...props
}: ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
    return (
        <div
            data-slot="item-media"
            data-variant={variant}
            className={cn(itemMediaVariants({ variant, className }))}
            {...props}
        />
    );
}

function ItemContent({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="item-content"
            className={cn('flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none', className)}
            {...props}
        />
    );
}

function ItemTitle({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="item-title"
            className={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', className)}
            {...props}
        />
    );
}

function ItemDescription({ className, ...props }: ComponentProps<'p'>) {
    return (
        <p
            data-slot="item-description"
            className={cn(
                'line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground',
                '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
                className,
            )}
            {...props}
        />
    );
}

function ItemActions({ className, ...props }: ComponentProps<'div'>) {
    return <div data-slot="item-actions" className={cn('flex items-center gap-2', className)} {...props} />;
}

function ItemHeader({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="item-header"
            className={cn('flex basis-full items-center justify-between gap-2', className)}
            {...props}
        />
    );
}

function ItemFooter({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="item-footer"
            className={cn('flex basis-full items-center justify-between gap-2', className)}
            {...props}
        />
    );
}

export {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
};
