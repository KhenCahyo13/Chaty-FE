import { useEffect } from 'react';

import { useThemeStore } from '@/stores/theme-store';

const ThemeSync = () => {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
    }, [theme]);

    return null;
};

export default ThemeSync;
