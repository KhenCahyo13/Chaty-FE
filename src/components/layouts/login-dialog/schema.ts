import z from 'zod';

import type { LoginFormValues } from './types';

export const loginFormSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const loginFormDefaultValues: LoginFormValues = {
    username: '',
    password: '',
};
