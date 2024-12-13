import ArticleDeleteModal from "@/components/modals/article-delete-modal"
import { SimpleArticle } from "@/interfaces/articles"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import React from "react"
import { FaRegEdit } from "react-icons/fa"
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
                    "inline-flex items-center gap-x-2 whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 lg:pr-8",
                )}>
                <ArticleDeleteModal article={props.article} />

                <Link
                    href={`/dashboard/articles/${props.article.id}/edit`}
                    aria-label={`Edit ${props.article.title} article`}
                    title={`Edit ${props.article.title} article`}>
                    <FaRegEdit
                        aria-hidden
                        className="size-4 text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800"
                    />
                </Link>
            </td>
        </tr>
    )
}
