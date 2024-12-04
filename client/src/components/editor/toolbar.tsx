"use client"

import { type Editor } from "@tiptap/react"
import { FaRedo, FaUndo } from "react-icons/fa"
import {
    FaBold,
    FaHeading,
    FaItalic,
    FaList,
    FaListOl,
    FaQuoteLeft,
    FaStrikethrough,
    FaUnderline,
} from "react-icons/fa6"

export default function Toolbar({ editor }: Readonly<{ editor: Editor | null }>) {
    if (!editor) return null
    return (
        <div className="flex flex-wrap items-center justify-start gap-4 rounded-md p-1.5 ring-1 ring-inset ring-neutral-300">
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleBold().run()
                }}
                className={
                    editor.isActive("bold")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle bold</span>
                <FaBold aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleItalic().run()
                }}
                className={
                    editor.isActive("italic")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle italic</span>
                <FaItalic aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleUnderline().run()
                }}
                className={
                    editor.isActive("underline")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle underline</span>
                <FaUnderline aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleStrike().run()
                }}
                className={
                    editor.isActive("strike")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle strike</span>
                <FaStrikethrough aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }}
                className={
                    editor.isActive("heading", { level: 2 })
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle heading</span>
                <FaHeading aria-hidden size={16} />
            </button>

            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleBulletList().run()
                }}
                className={
                    editor.isActive("bulletList")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle bullet list</span>
                <FaList aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleOrderedList().run()
                }}
                className={
                    editor.isActive("orderedList")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle ordered list</span>
                <FaListOl aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().toggleBlockquote().run()
                }}
                className={
                    editor.isActive("blockquote")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Toggle blockquote</span>
                <FaQuoteLeft aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().undo().run()
                }}
                className={
                    editor.isActive("undo")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Undo</span>
                <FaUndo aria-hidden size={16} />
            </button>
            <button
                onClick={e => {
                    e.preventDefault()
                    editor.chain().focus().redo().run()
                }}
                className={
                    editor.isActive("redo")
                        ? "rounded-md bg-neutral-700 p-2 text-neutral-50"
                        : "inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                }>
                <span className="sr-only">Redo</span>
                <FaRedo aria-hidden size={16} />
            </button>
        </div>
    )
}
