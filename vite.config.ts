import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        const modulePath = id.split('node_modules/')[1];
                        const topLevelFolder = modulePath?.split('/')[0];
                        if (topLevelFolder !== '.pnpm') return topLevelFolder;

                        const scopedPackageName = modulePath?.split('/')[1];

                        return scopedPackageName?.split('@')[scopedPackageName.startsWith('@') ? 1 : 0];
                    }
                },
            },
        },
    },
});
