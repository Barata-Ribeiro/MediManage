import { editorConfig }           from '@/components/blocks/editor-x/editor';
import { nodes }                  from '@/components/blocks/editor-x/nodes';
import { $generateHtmlFromNodes } from '@lexical/html';
import { createEditor }           from 'lexical';

/**
 * Converts Lexical JSON to HTML using Lexical's built-in utilities
 * @param lexicalJson - The Lexical JSON object (serialized editor state)
 * @returns The HTML string
 */
export function lexicalToHtml(lexicalJson: any): string {
    if (!lexicalJson?.root) {
        return '';
    }

    try {
        const templateEditor = createEditor({
            namespace: 'TemplateEditor',
            nodes: nodes,
            theme: editorConfig.theme,
            onError: (error) => {
                console.error('Lexical Editor Error:', error);
            },
        });

        // Set the editor state from the provided JSON
        templateEditor.setEditorState(templateEditor.parseEditorState(lexicalJson));

        let html = '';

        templateEditor.read(() => {
            html = $generateHtmlFromNodes(templateEditor);
        });

        return html;
    } catch (error) {
        console.error('Error converting Lexical JSON to HTML:', error);
        return '';
    }
}
