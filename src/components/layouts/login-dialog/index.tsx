import { useAuthStore } from '@/stores/auth-store';
import LoginDialogView from './view'

const LoginDialog = () => {
    const { token } = useAuthStore();

    return <LoginDialogView
        token={token}
    />;
};

export default LoginDialog;