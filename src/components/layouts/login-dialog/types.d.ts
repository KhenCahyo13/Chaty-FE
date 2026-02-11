import type { Token } from '@/types/auth';
import type z from 'zod';
import type { loginFormSchema } from './schema';
import type { useForm } from '@tanstack/react-form';

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export interface LoginDialogViewProps {
    form: ReturnType<typeof useForm<LoginFormValues>>;
    token: Token | null;
    isLoginLoading: boolean;
}