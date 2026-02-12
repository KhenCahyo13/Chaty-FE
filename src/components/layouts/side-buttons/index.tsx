import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { logout } from '@/api/auth';
import { resolveErrorMessage } from '@/lib/response';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import { usePushTokenStore } from '@/stores/push-token-store';
import { useThemeStore } from '@/stores/theme-store';

import SideButtonsView from './view';

const SideButtons = () => {
    const { theme, toggleTheme } = useThemeStore();
    const { setOpenProfileDialog } = useComponentsStore();
    const { clearAuth } = useAuthStore();
    const { setActivePrivateConversationId } = usePrivateConversationStore();
    const { clearDevices } = usePushTokenStore();

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        },
        onSuccess: () => {
            clearAuth();
            setActivePrivateConversationId(null);
            clearDevices();
        },
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <SideButtonsView
            handleLogout={handleLogout}
            handleToggleTheme={toggleTheme}
            isDarkTheme={theme === 'dark'}
            isLogoutLoading={logoutMutation.isPending}
            setOpenProfileDialog={setOpenProfileDialog}
        />
    );
};

export default SideButtons;
