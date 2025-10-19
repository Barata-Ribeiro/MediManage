import { $isTableSelection } from '@lexical/table';
import { $isRangeSelection, BaseSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { SubscriptIcon, SuperscriptIcon } from 'lucide-react';
import { useState } from 'react';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { useUpdateToolbarHandler } from '@/components/editor/editor-hooks/use-update-toolbar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function SubSuperToolbarPlugin() {
    const { activeEditor } = useToolbarContext();
    const [isSubscript, setIsSubscript] = useState(false);
    const [isSuperscript, setIsSuperscript] = useState(false);

    const $updateToolbar = (selection: BaseSelection) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));
        }
    };

    useUpdateToolbarHandler($updateToolbar);

    let defaultValue = '';
    if (isSubscript) {
        defaultValue = 'subscript';
    } else if (isSuperscript) {
        defaultValue = 'superscript';
    }

    return (
        <ToggleGroup type="single" defaultValue={defaultValue}>
            <ToggleGroupItem
                value="subscript"
                size="sm"
                aria-label="Toggle subscript"
                onClick={() => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
                }}
                variant={'outline'}
            >
                <SubscriptIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="superscript"
                size="sm"
                aria-label="Toggle superscript"
                onClick={() => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
                }}
                variant={'outline'}
            >
                <SuperscriptIcon className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
