import z from 'zod';

import type { CreateMessageFormValues } from './types';

const MAX_AUDIO_SIZE = 20 * 1024 * 1024;

export const createMessageFormSchema = z
    .object({
        audio: z
            .instanceof(File)
            .optional()
            .refine(
                (file) => !file || file.size <= MAX_AUDIO_SIZE,
                'Audio size cannot exceed 20MB.'
            ),
        content: z.string().optional(),
        private_conversation_id: z.uuid(
            'Invalid conversation id format. Must be a valid UUID.'
        ),
    })
    .superRefine((value, ctx) => {
        const hasContent = !!value.content?.trim();
        const hasAudio = !!value.audio;

        if (!hasContent && !hasAudio) {
            ctx.addIssue({
                code: 'custom',
                message: 'Message content or audio is required.',
                path: ['content'],
            });
        }
    });

export const createMessageFormDefaultValues: CreateMessageFormValues = {
    audio: undefined,
    content: '',
    private_conversation_id: '',
};
