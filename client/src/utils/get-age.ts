export default function getAge(birthday: string | null): number | string {
    if (!birthday) return "Unknown"

    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

    return age
}
