import getAllArticlesPaginated from "@/actions/articles/get-all-articles-paginated"
import ArticleListingheader from "@/components/dashboard/articles/articles-listing-header"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import ArticleTableRow from "@/components/dashboard/items/article-table-row"
import { PaginatedSimpleArticles } from "@/interfaces/articles"
import { auth } from "auth"
import { notFound, redirect } from "next/navigation"

interface ArticlePageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function ArticlePage({ params, searchParams }: Readonly<ArticlePageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const page = parseInt(searchParams.page as string, 10) ?? 0
    const perPage = parseInt(searchParams.perPage as string, 10) ?? 10
    const search = (searchParams.search as string) ?? ""
    const category = (searchParams.category as string) ?? ""
    const direction = (searchParams.direction as string) ?? "ASC"
    const orderBy = (searchParams.orderBy as string) ?? "createdAt"

    const sessionPromise = auth()
    const articleStatePromise = getAllArticlesPaginated({ page, perPage, search, category, direction, orderBy })

    const [session, articlesState] = await Promise.all([sessionPromise, articleStatePromise])

    if (session?.user.accountType !== "DOCTOR" && session?.user.accountType !== "ADMINISTRATOR") {
        return redirect(`/dashboard/${session?.user.username}`)
    }

    const pagination = articlesState.response?.data as PaginatedSimpleArticles
    const content = pagination.content
    const pageInfo = pagination.page

    return (
        <section
            id="written-articles-section"
            aria-labelledby="written-articles-section-title"
            className="px-4 sm:px-6 lg:px-8">
            <ArticleListingheader />

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6 lg:pl-8">
                                        Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 lg:table-cell">
                                        Sub Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                                        Author
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                                        Created At
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                        <span className="sr-only">Manage/Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length > 0 &&
                                    content.map((article, articleIdx) => (
                                        <ArticleTableRow
                                            key={article.id + articleIdx}
                                            article={article}
                                            index={articleIdx}
                                            length={content.length}
                                        />
                                    ))}

                                {content.length < 1 && (
                                    <tr className="border-b border-neutral-300 bg-white">
                                        <td
                                            colSpan={6}
                                            className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                            No articles found or available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <NavigationPagination usePageInfo={pageInfo} contentSize={content.length} />
                    </div>
                </div>
            </div>
        </section>
    )
}
