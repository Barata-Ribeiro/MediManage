import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import type { MarqueeProps as FastMarqueeProps } from 'react-fast-marquee';
import FastMarquee from 'react-fast-marquee';

export type MarqueeProps = HTMLAttributes<HTMLDivElement>;

export const Marquee = ({ className, ...props }: MarqueeProps) => (
    <div className={cn('relative w-full overflow-hidden', className)} {...props} />
);

export type MarqueeContentProps = FastMarqueeProps;

export const MarqueeContent = ({ loop = 0, autoFill = true, pauseOnHover = true, ...props }: MarqueeContentProps) => (
    <FastMarquee autoFill={autoFill} loop={loop} pauseOnHover={pauseOnHover} {...props} />
);

export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
    side: 'left' | 'right';
};

export const MarqueeFade = ({ className, side, ...props }: MarqueeFadeProps) => (
    <div
        className={cn(
            'absolute top-0 bottom-0 z-10 h-full w-24 from-background to-transparent',
            side === 'left' ? 'left-0 bg-linear-to-r' : 'right-0 bg-linear-to-l',
            className,
        )}
        {...props}
    />
);

export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;

export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
    <div className={cn('mx-2 shrink-0 object-contain', className)} {...props} />
);

// Demo
const colors = [
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-pink-500',
];

export function Demo() {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <Marquee>
                <MarqueeFade side="left" />
                <MarqueeContent speed={40}>
                    {colors.map((color, i) => (
                        <MarqueeItem key={i} className="mx-3">
                            <div className={cn('h-16 w-16 rounded-xl', color)} />
                        </MarqueeItem>
                    ))}
                </MarqueeContent>
                <MarqueeFade side="right" />
            </Marquee>
        </div>
    );
}
