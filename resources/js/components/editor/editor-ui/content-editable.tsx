import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';
import { JSX } from 'react';

type Props = {
    placeholder: string;
    className?: string;
    placeholderClassName?: string;
};

export function ContentEditable({ placeholder, className, placeholderClassName }: Readonly<Props>): JSX.Element {
    return (
        <LexicalContentEditable
            className={
                className ?? `ContentEditable__root relative block min-h-72 overflow-auto px-8 py-4 focus:outline-none`
            }
            aria-placeholder={placeholder}
            placeholder={
                <div
                    className={
                        placeholderClassName ??
                        `pointer-events-none absolute top-0 left-0 overflow-hidden px-8 py-[18px] text-ellipsis text-muted-foreground select-none`
                    }
                >
                    {placeholder}
                </div>
            }
        />
    );
}
