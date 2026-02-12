import { useThemeStore } from '@/stores/theme-store';

import SideButtonsView from './view';

const SideButtons = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <SideButtonsView
            isDarkTheme={theme === 'dark'}
            handleToggleTheme={toggleTheme}
        />
    );
};

export default SideButtons;
