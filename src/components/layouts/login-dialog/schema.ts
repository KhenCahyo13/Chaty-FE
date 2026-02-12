import z from 'zod';

import type { LoginFormValues } from './types';

export const loginFormSchema = z.object({
    password: z.string().min(1, 'Password is required'),
    username: z.string().min(1, 'Username is required'),
});

export const loginFormDefaultValues: LoginFormValues = {
    password: '',
    username: '',
};
