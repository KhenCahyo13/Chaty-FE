import z from 'zod';
import type { CreateMessageFormValues } from './types';

export const createMessageFormSchema = z.object({
    private_conversation_id: z.uuid('Invalid conversation id format. Must be a valid UUID.'),
    content: z.string().min(1, 'Message content cannot be empty.'),
});

export const createMessageFormDefaultValues: CreateMessageFormValues = {
    private_conversation_id: '',
    content: '',
};