import z from 'zod';

import type { UpdateProfileFormValues } from './types';

const ALLOWED_AVATAR_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, 'Full name is required.')
        .max(255, 'Full name maximum 255 characters.'),
    about: z
        .string()
        .trim()
        .max(100, 'About maximum 100 characters.')
        .optional(),
    avatar: z
        .instanceof(File, { message: 'Avatar must be a file.' })
        .refine((file) => ALLOWED_AVATAR_TYPES.includes(file.type), {
            message: 'Avatar must be jpg, jpeg, png, or webp.',
        })
        .refine((file) => file.size <= MAX_AVATAR_SIZE_BYTES, {
            message: 'Avatar maximum size is 2MB.',
        })
        .optional(),
});

export const updateProfileSchemaDefaultValues: UpdateProfileFormValues = {
    fullName: '',
    about: '',
    avatar: undefined,
};
