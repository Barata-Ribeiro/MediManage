import { editorConfig } from '@/components/blocks/editor-x/editor';
import { nodes } from '@/components/blocks/editor-x/nodes';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes, createEditor, SerializedEditorState } from 'lexical';

/**
 * Convert HTML string to Lexical-compatible string.
 * @param htmlStr - The HTML string to convert.
 * @returns The Lexical-compatible string.
 */
export function htmlToLexical(htmlStr: string): SerializedEditorState {
    const templateEditor = createEditor({
        namespace: 'TemplateEditor',
        nodes: nodes,
        theme: editorConfig.theme,
        onError: (error) => console.error('Lexical Editor Error:', error),
    });

    templateEditor.update(
        () => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlStr, 'text/html');

            const nodes = $generateNodesFromDOM(templateEditor, doc);

            $getRoot().select();
            $insertNodes(nodes);
        },
        { discrete: true },
    );

    return templateEditor.getEditorState().toJSON();
}
