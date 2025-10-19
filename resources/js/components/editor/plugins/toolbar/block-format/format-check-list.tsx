import { INSERT_CHECK_LIST_COMMAND } from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { blockTypeToBlockName } from '@/components/editor/plugins/toolbar/block-format/block-format-data';
import { SelectItem } from '@/components/ui/select';

const BLOCK_FORMAT_VALUE = 'check';

export function FormatCheckList() {
    const { activeEditor, blockType } = useToolbarContext();

    const formatParagraph = () => {
        activeEditor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    const formatCheckList = () => {
        if (blockType === 'number') {
            formatParagraph();
            return;
        }

        activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    };

    return (
        <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatCheckList}>
            <div className="flex items-center gap-1 font-normal">
                {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
                {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
            </div>
        </SelectItem>
    );
}
