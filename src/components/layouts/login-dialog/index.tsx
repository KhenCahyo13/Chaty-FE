import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { login } from '@/api/auth';
import { resolveErrorMessage } from '@/lib/response';
import { useAuthStore } from '@/stores/auth-store';

import { loginFormDefaultValues, loginFormSchema } from './schema';
import type { LoginFormValues } from './types';
import LoginDialogView from './view'

const LoginDialog = () => {
    const { token, setToken, setUser } = useAuthStore();

    const form = useForm({
        defaultValues: loginFormDefaultValues,
        validators: {
            onSubmit: loginFormSchema
        },
        onSubmit: async ({ value }) => {
            mutation.mutate(value);
        }
    });

    const mutation = useMutation({
        mutationFn: (data: LoginFormValues) => login(data),
        onSuccess: (response) => {
            setToken(response.meta!);
            setUser(response.data);

            form.reset();
        },
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        }
    });

    return <LoginDialogView
        form={form}
        token={token}
        isLoginLoading={mutation.isPending}
    />;
};

export default LoginDialog;