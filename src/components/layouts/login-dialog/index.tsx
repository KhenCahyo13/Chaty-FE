import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { login } from '@/api/auth';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useAuthStore } from '@/stores/auth-store';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import { loginFormDefaultValues, loginFormSchema } from './schema';
import type { LoginFormValues } from './types';
import LoginDialogView from './view';

const LoginDialog = () => {
    const { token, setToken, setUser } = useAuthStore();
    const { activePrivateConversationId } = usePrivateConversationStore();
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: loginFormDefaultValues,
        validators: {
            onSubmit: loginFormSchema
        },
        onSubmit: ({ value }) => {
            mutation.mutate(value);
        }
    });

    const mutation = useMutation({
        mutationFn: (data: LoginFormValues) => login(data),
        onSuccess: async (response) => {
            setToken(response.meta!);
            setUser(response.data);

            queryClient.invalidateQueries({
                queryKey: queryKeys.privateConversations.lists(),
            });

            if (activePrivateConversationId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.privateConversations.detail(activePrivateConversationId),
                });
            }
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
