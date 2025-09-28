import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { useUpdateToolbarHandler } from '@/components/editor/editor-hooks/use-update-toolbar';
import { blockTypeToBlockName } from '@/components/editor/plugins/toolbar/block-format/block-format-data';
import { Select, SelectContent, SelectGroup, SelectTrigger } from '@/components/ui/select';
import { $isListNode, ListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';
import { $isRangeSelection, $isRootOrShadowRoot, BaseSelection } from 'lexical';

export function BlockFormatDropDown({ children }: Readonly<{ children: React.ReactNode }>) {
    const { activeEditor, blockType, setBlockType } = useToolbarContext();

    function $updateToolbar(selection: BaseSelection) {
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            let element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : $findMatchingParent(anchorNode, (e) => {
                          const parent = e.getParent();
                          return parent !== null && $isRootOrShadowRoot(parent);
                      });

            element ??= anchorNode.getTopLevelElementOrThrow();

            const elementKey = element.getKey();
            const elementDOM = activeEditor.getElementByKey(elementKey);

            if (elementDOM !== null) {
                // setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
                    const type = parentList ? parentList.getListType() : element.getListType();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                }
            }
        }
    }

    useUpdateToolbarHandler($updateToolbar);

    return (
        <Select
            value={blockType}
            onValueChange={(value) => {
                setBlockType(value);
            }}
        >
            <SelectTrigger className="!h-8 w-min gap-1">
                {blockTypeToBlockName[blockType].icon}
                <span>{blockTypeToBlockName[blockType].label}</span>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>{children}</SelectGroup>
            </SelectContent>
        </Select>
    );
}
