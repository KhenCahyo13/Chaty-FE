import type { useForm } from '@tanstack/react-form';
import type z from 'zod';

import type { Token } from '@/types/auth';

import type { loginFormSchema } from './schema';

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export interface LoginDialogViewProps {
    form: ReturnType<typeof useForm<LoginFormValues>>;
    isLoginLoading: boolean;
    token: null | Token;
}
