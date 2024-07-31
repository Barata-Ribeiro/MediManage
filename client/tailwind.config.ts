import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            container: { center: true, padding: "1rem" },
        },
    },
    plugins: [require("@tailwindcss/forms")],
}
export default config
