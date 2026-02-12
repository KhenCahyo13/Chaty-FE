import z from 'zod';

import type { CreateMessageFormValues } from './types';

export const createMessageFormSchema = z.object({
    content: z.string().min(1, 'Message content cannot be empty.'),
    private_conversation_id: z.uuid(
        'Invalid conversation id format. Must be a valid UUID.'
    ),
});

export const createMessageFormDefaultValues: CreateMessageFormValues = {
    content: '',
    private_conversation_id: '',
};
