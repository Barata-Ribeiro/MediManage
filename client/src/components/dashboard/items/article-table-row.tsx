import { SimpleArticle } from "@/interfaces/articles"
import parseDate from "@/utils/parse-date"
import React from "react"
import { twMerge } from "tailwind-merge"

interface ArticleTableRowProps {
    index: number
    length: number
    article: SimpleArticle
}

export default function ArticleTableRow(props: Readonly<ArticleTableRowProps>) {
    return (
        <tr className="border-b border-neutral-300 bg-white">
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-700 sm:pl-6 lg:pl-8",
                )}>
                {props.article.id}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "whitespace-nowrap px-3 py-4 text-sm text-neutral-700",
                )}>
                {props.article.title}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "hidden whitespace-nowrap px-3 py-4 text-sm text-neutral-700 lg:table-cell",
                )}>
                {props.article.subTitle}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "whitespace-nowrap px-3 py-4 text-sm text-neutral-700",
                )}>
                {props.article.author.fullName ?? props.article.author.username}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "whitespace-nowrap px-3 py-4 text-sm text-neutral-900",
                )}>
                {parseDate(props.article.createdAt)}
            </td>

            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "whitespace-nowrap py-4 pl-3 pr-4 text-sm text-neutral-900 sm:pr-6 lg:pr-8",
                )}>
                {/* TODO: ADD BUTTONS */}
            </td>
        </tr>
    )
}
