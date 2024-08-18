"use client"

import { StarterKit } from "@tiptap/starter-kit"
import { EditorContent, useEditor } from "@tiptap/react"
import { Underline } from "@tiptap/extension-underline"
import Toolbar from "@/components/editor/toolbar"
import { Heading } from "@tiptap/extension-heading"
import { OrderedList } from "@tiptap/extension-ordered-list"
import { BulletList } from "@tiptap/extension-bullet-list"
import { ListItem } from "@tiptap/extension-list-item"

export default function Tiptap({ onUpdate }: Readonly<never>) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Heading.configure({ levels: [2], HTMLAttributes: { class: "font-heading text-2xl" } }),
            BulletList.configure({ HTMLAttributes: { class: "list-disc list-inside space-y-1" } }),
            OrderedList.configure({ HTMLAttributes: { class: "list-decimal list-inside space-y-1" } }),
            ListItem.configure({ HTMLAttributes: { class: "list-item [&>p]:inline-block" } }),
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
