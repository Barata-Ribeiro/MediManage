export default function parseDate(date?: string | null): string {
    if (!date) return "Unknown"

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split("-").map(Number)
        const localDate = new Date(year, month - 1, day)

        return localDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    })
}
