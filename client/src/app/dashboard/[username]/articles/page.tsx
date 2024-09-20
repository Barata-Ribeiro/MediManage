import { notFound } from "next/navigation"
import getUserContext from "@/actions/users/get-user-context"
import logout from "@/actions/auth/logout"
import ArticleListingheader from "@/components/dashboard/articles/articles-listing-header"

interface ArticlePageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function ArticlePage({ params, searchParams }: Readonly<ArticlePageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const search = (searchParams.search as string) ?? ""
    const page = parseInt(searchParams.page as string, 10) ?? 0
    const perPage = parseInt(searchParams.perPage as string, 10) ?? 10
    const direction = (searchParams.direction as string) ?? "DESC"
    const orderBy = (searchParams.orderBy as string) ?? "createdAt"

    const context = await getUserContext()
    if (!context.ok) await logout()

    const state = ""

    const pagination = ""
    const content = ""
    const pageInfo = ""

    return (
        <section
            id="written-articles-section"
            aria-labelledby="written-articles-section-title"
            className="px-4 sm:px-6 lg:px-8">
            <ArticleListingheader />
        </section>
    )
}
