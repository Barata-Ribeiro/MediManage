import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { blockTypeToBlockName } from '@/components/editor/plugins/toolbar/block-format/block-format-data';
import { SelectItem } from '@/components/ui/select';
import { $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';

const BLOCK_FORMAT_VALUE = 'code';

export function FormatCodeBlock() {
    const { activeEditor, blockType } = useToolbarContext();

    const formatCode = () => {
        if (blockType !== 'code') {
            activeEditor.update(() => {
                let selection = $getSelection();

                if (selection !== null) {
                    if (selection.isCollapsed()) {
                        $setBlocksType(selection, () => $createCodeNode());
                    } else {
                        const textContent = selection.getTextContent();
                        const codeNode = $createCodeNode();
                        selection.insertNodes([codeNode]);
                        selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            selection.insertRawText(textContent);
                        }
                    }
                }
            });
        }
    };

    return (
        <SelectItem value="code" onPointerDown={formatCode}>
            <div className="flex items-center gap-1 font-normal">
                {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
                {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
            </div>
        </SelectItem>
    );
}
