import { uuid as UUID }                                                                           from '@/components/editor/plugins/autocomplete-plugin';
import type { DOMExportOutput, EditorConfig, LexicalEditor, NodeKey, SerializedTextNode, Spread } from 'lexical';
import { TextNode }                                                                               from 'lexical';

export type SerializedAutocompleteNode = Spread<
    {
        uuid: string;
    },
    SerializedTextNode
>;

export class AutocompleteNode extends TextNode {
    /**
     * A unique uuid is generated for each session and assigned to the instance.
     * This helps to:
     * - Ensures max one Autocomplete node per session.
     * - Ensure that when collaboration is enabled, this node is not shown in
     *   other sessions.
     * See https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/AutocompletePlugin/index.tsx
     */
    __uuid: string;

    constructor(text: string, uuid: string, key?: NodeKey) {
        super(text, key);
        this.__uuid = uuid;
    }

    static clone(node: AutocompleteNode): AutocompleteNode {
        return new AutocompleteNode(node.__text, node.__uuid, node.__key);
    }

    static getType(): 'autocomplete' {
        return 'autocomplete';
    }

    static importDOM() {
        // Never import from DOM
        return null;
    }

    static importJSON(serializedNode: SerializedAutocompleteNode): AutocompleteNode {
        return $createAutocompleteNode(serializedNode.text, serializedNode.uuid).updateFromJSON(serializedNode);
    }

    exportJSON(): SerializedAutocompleteNode {
        return {
            ...super.exportJSON(),
            uuid: this.__uuid,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exportDOM(_: LexicalEditor): DOMExportOutput {
        return { element: null };
    }

    excludeFromCopy() {
        return true;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.classList.add(config.theme.autocomplete);
        if (this.__uuid !== UUID) {
            dom.style.display = 'none';
        }
        return dom;
    }
}

export function $createAutocompleteNode(text: string, uuid: string): AutocompleteNode {
    return new AutocompleteNode(text, uuid).setMode('token');
}
