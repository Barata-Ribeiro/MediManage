import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as React from 'react';
import { HexColorPicker } from 'react-colorful';

type Props = {
    disabled?: boolean;
    icon?: React.ReactNode;
    title?: string;
    color: string;
    onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export default function ColorPicker({ disabled = false, color, onChange, icon, ...rest }: Readonly<Props>) {
    return (
        <Popover modal={true}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button size={'icon'} className="!h-8 !w-8" variant={'outline'} {...rest}>
                    <span className="size-4 rounded-full">{icon}</span>
                    {/* <ChevronDownIcon className='size-4'/> */}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <HexColorPicker color={color} onChange={(color) => onChange?.(color, false)} />
                <Input
                    maxLength={7}
                    onChange={(e) => {
                        e.stopPropagation();
                        onChange?.(e?.currentTarget?.value, false);
                    }}
                    value={color}
                />
            </PopoverContent>
        </Popover>
    );
}
