import type { useForm } from '@tanstack/react-form';
import type { VirtualItem } from '@tanstack/react-virtual';
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
    message: ChatRoomMessage;
}

export interface ChatHeaderProps {
    receiver: PrivateConversationListUser | undefined;
}

export interface ChatRoomMessageFileMeta {
    fileName: string;
    isImage: boolean;
    url: string;
}

export type ChatRoomMessage = PrivateConversationDetailsMessage & {
    fileMeta?: ChatRoomMessageFileMeta[];
};

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
    messageForm: ReturnType<typeof useForm<CreateMessageFormValues>>;
    messages: ChatRoomMessage[];
    messagesContainerRef: RefObject<HTMLDivElement | null>;
    messageVirtualItems: VirtualItem[];
    messageVirtualMeasureElement: (element: Element | null) => void;
    messageVirtualTotalSize: number;
    room: PrivateConversationDetails | undefined;
}
