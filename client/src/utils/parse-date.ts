export default function parseDate(date?: string | null): string {
    if (!date) return "Unknown"
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}
