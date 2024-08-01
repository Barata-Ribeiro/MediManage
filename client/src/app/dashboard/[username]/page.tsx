import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    return {
        title: params.username,
        description: "Dashboard from " + params.username,
    }
}

export default function Page() {
    return (
        <div className="h-full rounded-md bg-neutral-50 p-4 shadow-derek">
            <p>
                Iaculisneque usu platonem nullam fuisset purus persequeris animal civibus maiestatis dolorum.
                Inceptossodales massa quidam nostrum duo quo turpis. Porrotincidunt periculis dui felis iisque fusce
                tation. Agaminani ignota quas prompta. Nostraconsectetur mattis vim vocent libris ullamcorper mucius
                oratio fugit.
            </p>
            <p>
                Iaculisneque usu platonem nullam fuisset purus persequeris animal civibus maiestatis dolorum.
                Inceptossodales massa quidam nostrum duo quo turpis. Porrotincidunt periculis dui felis iisque fusce
                tation. Agaminani ignota quas prompta. Nostraconsectetur mattis vim vocent libris ullamcorper mucius
                oratio fugit.
            </p>
            <p>
                Iaculisneque usu platonem nullam fuisset purus persequeris animal civibus maiestatis dolorum.
                Inceptossodales massa quidam nostrum duo quo turpis. Porrotincidunt periculis dui felis iisque fusce
                tation. Agaminani ignota quas prompta. Nostraconsectetur mattis vim vocent libris ullamcorper mucius
                oratio fugit.
            </p>
            <p>
                Iaculisneque usu platonem nullam fuisset purus persequeris animal civibus maiestatis dolorum.
                Inceptossodales massa quidam nostrum duo quo turpis. Porrotincidunt periculis dui felis iisque fusce
                tation. Agaminani ignota quas prompta. Nostraconsectetur mattis vim vocent libris ullamcorper mucius
                oratio fugit.
            </p>
        </div>
    )
}
