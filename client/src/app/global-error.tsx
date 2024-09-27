"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html>
            <body>
                <h1 style={{ fontWeight: "bold" }}>{error.name}</h1>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    )
}
