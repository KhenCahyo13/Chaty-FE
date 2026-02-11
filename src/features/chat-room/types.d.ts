import type {
    PrivateConversationDetails,
    PrivateConversationDetailsMessage,
    PrivateConversationListUser,
} from '@/types/private-conversation';
import type z from 'zod';
import type { createMessageFormSchema } from './schema';
import type { useForm } from '@tanstack/react-form';
import type { RefObject } from 'react';

export type CreateMessageFormValues = z.infer<typeof createMessageFormSchema>;

export interface ChatBoxProps {
    form: ReturnType<typeof useForm<CreateMessageFormValues>>;
    isCreateMessageLoading: boolean;
}

export interface ChatBubbleProps {
    message: PrivateConversationDetailsMessage;
}

export interface ChatHeaderProps {
    receiver: PrivateConversationListUser | undefined;
}

export interface ChatRoomViewProps {
    messageForm: ReturnType<typeof useForm<CreateMessageFormValues>>;
    activePrivateConversationId: string | null;
    conversations: PrivateConversationDetails | undefined;
    isConversationsLoading: boolean;
    isConversationsError: boolean;
    isCreateMessageLoading: boolean;
}
