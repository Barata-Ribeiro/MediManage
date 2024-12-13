import getPublicArticleById from "@/actions/articles/get-public-article-by-id"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { auth } from "auth"
import { notFound, redirect } from "next/navigation"

interface ManageArticlePageProps {
    params: { username: string; artId: number }
}

export default async function ManageArticle({ params }: ManageArticlePageProps) {
    if (!params.username || !params.artId) return notFound()

    const sessionPromise = auth()
    const statePromise = getPublicArticleById({ id: params.artId })

    const [session, state] = await Promise.all([sessionPromise, statePromise])

    if (!state.ok) return <StateError error={state.error as ProblemDetails} />
    if (session?.user.accountType !== "ADMINISTRATOR" && session?.user.accountType !== "DOCTOR") {
        return redirect(`/dashboard/${session?.user.username ?? params.username}`)
    }

    return <section></section>
}
