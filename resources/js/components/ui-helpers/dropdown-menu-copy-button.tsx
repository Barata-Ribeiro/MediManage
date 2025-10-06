import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { ReactNode } from 'react';
import { toast } from 'sonner';

interface RawCopyButtonProps {
    content: unknown;
    children: ReactNode;
}

export default function DropdownMenuCopyButton({ content, children }: Readonly<RawCopyButtonProps>) {
    const [copiedText, copy] = useClipboard();

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start px-2"
            disabled={copiedText === String(content)}
            onClick={() => copy(String(content)).then(() => toast.info('Copied to clipboard!', { duration: 2000 }))}
        >
            {children}
        </Button>
    );
}
