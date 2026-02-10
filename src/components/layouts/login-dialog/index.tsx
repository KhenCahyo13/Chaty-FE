import { useAuthStore } from '@/stores/auth-store';
import LoginDialogView from './view'
import { useForm } from '@tanstack/react-form';
import { loginFormDefaultValues, loginFormSchema } from './schema';

const LoginDialog = () => {
    const { token } = useAuthStore();

    const form = useForm({
        defaultValues: loginFormDefaultValues,
        validators: {
            onSubmit: loginFormSchema
        },
        onSubmit: async ({ value }) => {
            console.log('Login form submitted with values:', value);
        }
    });

    return <LoginDialogView
        form={form}
        token={token}
    />;
};

export default LoginDialog;