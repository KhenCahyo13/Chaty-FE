import type { useForm } from '@tanstack/react-form';
import type { RefObject, UIEvent } from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';
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
    activePrivateConversationId: null | string;
    filesResetKey: number;
    handleScrollMessages: (
        e: UIEvent<HTMLDivElement, globalThis.UIEvent>
    ) => void;
    isCreateMessageLoading: boolean;
    isFetchingNextMessagesPage: boolean;
    isRoomError: boolean;
    isRoomLoading: boolean;
    messageVirtualItems: VirtualItem[];
    messageVirtualTotalSize: number;
    messageVirtualMeasureElement: (
        element: Element | null
    ) => void;
    messageForm: ReturnType<typeof useForm<CreateMessageFormValues>>;
    messages: PrivateConversationDetailsMessage[];
    messagesContainerRef: RefObject<HTMLDivElement | null>;
    room: PrivateConversationDetails | undefined;
}
