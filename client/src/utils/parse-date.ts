export default function parseDate(date?: string | null): string {
    if (!date) return "Unknown"

    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(date).toLocaleDateString("en-US", {
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
