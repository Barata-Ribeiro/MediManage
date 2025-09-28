import { $createYouTubeNode, YouTubeNode } from '@/components/editor/nodes/embeds/youtube-node';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { JSX, useEffect } from 'react';

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand('INSERT_YOUTUBE_COMMAND');

export function YouTubePlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([YouTubeNode])) {
            throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
        }

        return editor.registerCommand<string>(
            INSERT_YOUTUBE_COMMAND,
            (payload) => {
                const youTubeNode = $createYouTubeNode(payload);
                $insertNodeToNearestRoot(youTubeNode);

                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
