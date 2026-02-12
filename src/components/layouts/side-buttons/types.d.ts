export interface SideButtonsViewProps {
    handleLogout: () => void;
    handleToggleTheme: () => void;
    isDarkTheme: boolean;
    isLogoutLoading: boolean;
    setOpenProfileDialog: (open: boolean) => void;
}
