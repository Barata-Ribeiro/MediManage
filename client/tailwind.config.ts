import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            container: { center: true, padding: "1rem" },
            fontFamily: {
                heading: ["var(--font-roboto)", "system-ui", "sans-serif"],
                body: ["var(--font-nunito)", "system-ui", "sans-serif"],
            },
            colors: {
                "mourning-blue": {
                    "100": "#F2F4FF",
                    "200": "#BBC5FE",
                    "300": "#819BF8",
                    "400": "#4773E8",
                    "500": "#124FC9",
                    "600": "#0643A1",
                    "700": "#013778",
                    "800": "#00284F",
                    "900": "#001626",
                },
                "hello-spring": {
                    "100": "#F2FFF7",
                    "200": "#C9FFDB",
                    "300": "#9EFCB8",
                    "400": "#71F58F",
                    "500": "#46E861",
                    "600": "#22B832",
                    "700": "#118717",
                    "800": "#0A5709",
                    "900": "#062604",
                },
                neutral: {
                    "100": "#FAFAFC",
                    "200": "#EAEAED",
                    "300": "#D9DADE",
                    "400": "#C9CACF",
                    "500": "#BABBBF",
                    "600": "#929499",
                    "700": "#6B6E73",
                    "800": "#46494D",
                    "900": "#222426",
                },
            },
            boxShadow: {
                derek:
                    "0px 0px 0px 1px rgb(0 0 0 / 0.06),\n" +
                    "0px 1px 1px -0.5px rgb(0 0 0 / 0.06),\n" +
                    "0px 3px 3px -1.5px rgb(0 0 0 / 0.06), \n" +
                    "0px 6px 6px -3px rgb(0 0 0 / 0.06),\n" +
                    "0px 12px 12px -6px rgb(0 0 0 / 0.06),\n" +
                    "0px 24px 24px -12px rgb(0 0 0 / 0.06);",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
}
export default config
