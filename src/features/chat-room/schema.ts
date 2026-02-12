import z from 'zod';

import {
    ALLOWED_CHAT_FILE_EXTENSIONS,
    MAX_AUDIO_SIZE,
    MAX_CHAT_FILE_SIZE,
} from '@/constants/file';

import type { CreateMessageFormValues } from './types';

const getFileExtension = (fileName: string) => {
    const dotIndex = fileName.lastIndexOf('.');

    if (dotIndex < 0) {
        return '';
    }

    return fileName.slice(dotIndex).toLowerCase();
};

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
        files: z
            .array(z.instanceof(File))
            .optional()
            .refine(
                (files) =>
                    !files ||
                    files.every((file) => file.size <= MAX_CHAT_FILE_SIZE),
                'Each file size cannot exceed 20MB.'
            )
            .refine(
                (files) =>
                    !files ||
                    files.every((file) =>
                        ALLOWED_CHAT_FILE_EXTENSIONS.has(
                            getFileExtension(file.name)
                        )
                    ),
                'Some files have unsupported extension.'
            ),
        private_conversation_id: z.uuid(
            'Invalid conversation id format. Must be a valid UUID.'
        ),
    })
    .superRefine((value, ctx) => {
        const hasContent = !!value.content?.trim();
        const hasAudio = !!value.audio;
        const hasFiles = !!value.files?.length;

        if (!hasContent && !hasAudio && !hasFiles) {
            ctx.addIssue({
                code: 'custom',
                message: 'Message content, audio, or files is required.',
                path: ['content'],
            });
        }
    });

export const createMessageFormDefaultValues: CreateMessageFormValues = {
    audio: undefined,
    content: '',
    files: [],
    private_conversation_id: '',
};
