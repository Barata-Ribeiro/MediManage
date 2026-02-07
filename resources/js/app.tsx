import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

await createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const inertiaApp = (
            <StrictMode>
                <App {...props} />
            </StrictMode>
        );

        if (el.hasChildNodes()) {
            hydrateRoot(el, inertiaApp);

            return;
        }

        createRoot(el).render(inertiaApp);
    },
    progress: { color: 'oklch(0.474 0.1989 262.1884)' },
    defaults: {
        future: {
            useScriptElementForInitialPage: true,
        },
        prefetch: {
            cacheFor: '1m',
            hoverDelay: 150,
        },
    },
});

// This will set light / dark mode on load...
initializeTheme();
