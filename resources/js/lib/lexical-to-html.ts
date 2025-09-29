import { editorConfig }                        from '@/components/blocks/editor-x/editor';
import { nodes }                               from '@/components/blocks/editor-x/nodes';
import { $generateHtmlFromNodes }              from '@lexical/html';
import { createEditor, SerializedEditorState } from 'lexical';

/**
 * Converts Lexical JSON to HTML using Lexical's built-in utilities
 * @param lexicalJson - The Lexical JSON object (serialized editor state)
 * @returns The HTML string
 */
export function lexicalToHtml(lexicalJson: unknown): string {
    if (!lexicalJson || typeof lexicalJson !== 'object') return '';

    if (!('root' in lexicalJson)) return '';

    const state = lexicalJson as SerializedEditorState;

    try {
        const templateEditor = createEditor({
            namespace: 'TemplateEditor',
            nodes: nodes,
            theme: editorConfig.theme,
            onError: (error) => console.error('Lexical Editor Error:', error),
        });

        templateEditor.setEditorState(templateEditor.parseEditorState(state));

        let html = '';

        templateEditor.read(() => (html = $generateHtmlFromNodes(templateEditor)));

        return html;
    } catch (error) {
        console.error('Error converting Lexical JSON to HTML:', error);
        return '';
    }
}
