import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IS_APPLE, mergeRegister } from '@lexical/utils';
import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import { RedoIcon, UndoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export function HistoryToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { activeEditor, $updateToolbar } = useToolbarContext();
    const [isEditable, setIsEditable] = useState(editor.isEditable());
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    useEffect(() => {
        return mergeRegister(
            editor.registerEditableListener((editable) => {
                setIsEditable(editable);
            }),
            activeEditor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            activeEditor.registerCommand<boolean>(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            activeEditor.registerCommand<boolean>(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        );
    }, [$updateToolbar, activeEditor, editor]);

    return (
        <ButtonGroup>
            <Button
                type="button"
                disabled={!canUndo || !isEditable}
                onClick={() => {
                    activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
                aria-label="Undo"
                size="icon"
                className="!h-8 !w-8"
                variant={'outline'}
            >
                <UndoIcon className="size-4" />
            </Button>
            <Button
                type="button"
                disabled={!canRedo || !isEditable}
                onClick={() => {
                    activeEditor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
                aria-label="Redo"
                variant={'outline'}
                size="icon"
                className="!h-8 !w-8"
            >
                <RedoIcon className="size-4" />
            </Button>
        </ButtonGroup>
    );
}
