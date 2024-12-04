import Toolbar from "@/components/editor/toolbar"
import { Underline } from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Dispatch, SetStateAction } from "react"

interface TiptapProps {
    onUpdate: Dispatch<SetStateAction<string>>
}

export default function Tiptap({ onUpdate }: Readonly<TiptapProps>) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2],
                    HTMLAttributes: { class: "font-heading text-2xl" },
                },
                bulletList: {
                    HTMLAttributes: { class: "list-disc list-inside space-y-1" },
                },
                orderedList: {
                    HTMLAttributes: { class: "list-decimal list-inside space-y-1" },
                },
                listItem: {
                    HTMLAttributes: { class: "list-item [&>p]:inline-block" },
                },
            }),
            Underline,
        ],
        editorProps: {
            attributes: {
                class: "block min-h-96 rounded-md border-0 p-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:leading-6 font-body",
            },
        },
        onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
        immediatelyRender: false,
    })

    return (
        <div className="grid w-full gap-2">
            <Toolbar editor={editor} />
            <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
        </div>
    )
}
