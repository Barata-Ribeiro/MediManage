import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { useUpdateToolbarHandler } from '@/components/editor/editor-hooks/use-update-toolbar';
import { Toggle } from '@/components/ui/toggle';
import { $isTableSelection } from '@lexical/table';
import { $isRangeSelection, BaseSelection, FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { useState } from 'react';

const Icons: Partial<Record<TextFormatType, React.ElementType>> = {
    bold: BoldIcon,
    italic: ItalicIcon,
    underline: UnderlineIcon,
    strikethrough: StrikethroughIcon,
    code: CodeIcon,
} as const;

export function FontFormatToolbarPlugin({
    format,
}: Readonly<{
    format: Omit<TextFormatType, 'highlight' | 'subscript' | 'superscript'>;
}>) {
    const { activeEditor } = useToolbarContext();
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const $updateToolbar = (selection: BaseSelection) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            setIsSelected(selection.hasFormat(format as TextFormatType));
        }
    };

    useUpdateToolbarHandler($updateToolbar);

    const Icon = Icons[format as TextFormatType] as React.ElementType;

    return (
        <Toggle
            aria-label="Toggle bold"
            variant="outline"
            size="sm"
            defaultPressed={isSelected}
            pressed={isSelected}
            onPressedChange={setIsSelected}
            onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);
            }}
        >
            <Icon className="size-4" />
        </Toggle>
    );
}
