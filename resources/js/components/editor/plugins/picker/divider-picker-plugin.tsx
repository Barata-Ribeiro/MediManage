import { ComponentPickerOption } from '@/components/editor/plugins/picker/component-picker-option';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { MinusIcon } from 'lucide-react';

export function DividerPickerPlugin() {
    return new ComponentPickerOption('Divider', {
        icon: <MinusIcon className="size-4" />,
        keywords: ['horizontal rule', 'divider', 'hr'],
        onSelect: (_, editor) => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    });
}
