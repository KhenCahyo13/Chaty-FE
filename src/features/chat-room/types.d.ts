import type { useForm } from '@tanstack/react-form';
import type { RefObject, UIEvent } from 'react';
import type z from 'zod';

import type {
    PrivateConversationDetails,
    PrivateConversationDetailsMessage,
    PrivateConversationListUser,
} from '@/types/private-conversation';

import type { createMessageFormSchema } from './schema';

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
    room: PrivateConversationDetails | undefined;
    messages: PrivateConversationDetailsMessage[];
    isRoomLoading: boolean;
    isRoomError: boolean;
    isCreateMessageLoading: boolean;
    isFetchingNextMessagesPage: boolean;
    handleScrollMessages: (
        e: UIEvent<HTMLDivElement, globalThis.UIEvent>
    ) => void;
    messagesContainerRef: RefObject<HTMLDivElement | null>;
}
