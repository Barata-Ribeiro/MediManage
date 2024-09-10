/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    experimental: {
        optimizePackageImports: ["tailwindcss", "@headlessui/react", "react-icons/fa6"],
        serverComponentsExternalPackages: ["@react-pdf/renderer"],
    },
}

export default nextConfig
