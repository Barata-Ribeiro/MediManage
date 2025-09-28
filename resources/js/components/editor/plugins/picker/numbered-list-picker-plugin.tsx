import { ComponentPickerOption } from '@/components/editor/plugins/picker/component-picker-option';
import { INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { ListOrderedIcon } from 'lucide-react';

export function NumberedListPickerPlugin() {
    return new ComponentPickerOption('Numbered List', {
        icon: <ListOrderedIcon className="size-4" />,
        keywords: ['numbered list', 'ordered list', 'ol'],
        onSelect: (_, editor) => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    });
}
