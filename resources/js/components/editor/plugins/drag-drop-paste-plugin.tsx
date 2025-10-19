/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { isMimeType, mediaFileReader } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW } from 'lexical';
import { useEffect } from 'react';

import { INSERT_IMAGE_COMMAND } from '@/components/editor/plugins/images-plugin';

const ACCEPTABLE_IMAGE_TYPES = ['image/', 'image/heic', 'image/heif', 'image/gif', 'image/webp'];

export function DragDropPastePlugin(): null {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        // Process files in a separate async function to avoid deep nesting in the command handler.
        async function processFiles(files: File[]): Promise<void> {
            const filesResult = await mediaFileReader(files, [ACCEPTABLE_IMAGE_TYPES].flat());
            for (const { file, result } of filesResult) {
                if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        altText: file.name,
                        src: result,
                    });
                }
            }
        }

        return editor.registerCommand(
            DRAG_DROP_PASTE,
            (files) => {
                void processFiles(files);
                return true;
            },
            COMMAND_PRIORITY_LOW,
        );
    }, [editor]);
    return null;
}
