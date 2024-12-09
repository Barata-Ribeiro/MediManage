import getAllArticlesPaginated from "@/actions/articles/get-all-articles-paginated"
import ArticleListingheader from "@/components/dashboard/articles/articles-listing-header"
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
        </section>
    )
}
