import { $isCodeNode } from '@lexical/code';
import { $getNearestNodeFromDOMNode, $getSelection, $setSelection, LexicalEditor } from 'lexical';
import { CircleCheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { useDebounce } from '@/components/editor/editor-hooks/use-debounce';

interface Props {
    editor: LexicalEditor;
    getCodeDOMNode: () => HTMLElement | null;
}

export function CopyButton({ editor, getCodeDOMNode }: Readonly<Props>) {
    const [isCopyCompleted, setIsCopyCompleted] = useState<boolean>(false);

    const removeSuccessIcon = useDebounce(() => setIsCopyCompleted(false), 1000);

    async function handleClick(): Promise<void> {
        const codeDOMNode = getCodeDOMNode();

        if (!codeDOMNode) {
            return;
        }

        let content = '';

        editor.update(() => {
            const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

            if ($isCodeNode(codeNode)) {
                content = codeNode.getTextContent();
            }

            const selection = $getSelection();
            $setSelection(selection);
        });

        try {
            await navigator.clipboard.writeText(content);
            setIsCopyCompleted(true);
            removeSuccessIcon();
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    return (
        <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center rounded border border-transparent bg-none p-1 text-foreground/50 uppercase"
            onClick={handleClick}
            aria-label="copy"
        >
            {isCopyCompleted ? <CircleCheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        </button>
    );
}
