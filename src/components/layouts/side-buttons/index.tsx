import { useComponentsStore } from '@/stores/components';
import { useThemeStore } from '@/stores/theme-store';

import SideButtonsView from './view';

const SideButtons = () => {
    const { theme, toggleTheme } = useThemeStore();
    const { setOpenProfileDialog } = useComponentsStore();

    return (
        <SideButtonsView
            handleToggleTheme={toggleTheme}
            isDarkTheme={theme === 'dark'}
            setOpenProfileDialog={setOpenProfileDialog}
        />
    );
};

export default SideButtons;
