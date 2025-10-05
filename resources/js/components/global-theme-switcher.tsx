import { useAppearance } from '@/hooks/use-appearance';
import { ThemeToggleButton, useThemeTransition } from './theme-toggle-button';

export default function GlobalThemeSwitcher() {
    const { appearance, updateAppearance } = useAppearance();
    const { startTransition } = useThemeTransition();

    return (
        <div className="fixed right-4 bottom-4 z-50 md:right-8 md:bottom-8">
            <ThemeToggleButton
                theme={appearance === 'system' ? undefined : appearance}
                onClick={() => startTransition(() => updateAppearance(appearance === 'dark' ? 'light' : 'dark'))}
                variant="circle"
                start="bottom-right"
            />
        </div>
    );
}
