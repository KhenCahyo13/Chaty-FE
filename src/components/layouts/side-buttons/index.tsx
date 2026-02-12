import { useComponentsStore } from '@/stores/components';
import { useThemeStore } from '@/stores/theme-store';

import SideButtonsView from './view';

const SideButtons = () => {
    const { theme, toggleTheme } = useThemeStore();
    const { setOpenProfileDialog } = useComponentsStore();

    return (
        <SideButtonsView
            isDarkTheme={theme === 'dark'}
            handleToggleTheme={toggleTheme}
            setOpenProfileDialog={setOpenProfileDialog}
        />
    );
};

export default SideButtons;
