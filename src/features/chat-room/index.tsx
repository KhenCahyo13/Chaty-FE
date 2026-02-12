import { useForm } from '@tanstack/react-form';
import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { fetchPrivateConversationDetails, fetchPrivateConversationMessagesById } from '@/api/private-conversations';
import { createMessage } from '@/api/private-messages';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';

import { useChatRoomScroll } from './hooks/use-chat-room-scroll';
import { usePrivateMessageRead } from './hooks/use-private-message-read';
import { createMessageFormDefaultValues, createMessageFormSchema } from './schema';
import type { CreateMessageFormValues } from './types';
import ChatRoomView from './view'

const ChatRoom = () => {
    const { activePrivateConversationId } = usePrivateConversationStore();
    const queryClient = useQueryClient();

    const { data: room, isLoading: isRoomLoading, isError: isRoomError } = useQuery({
        queryKey: queryKeys.privateConversations.detail(activePrivateConversationId!),
        queryFn: () => fetchPrivateConversationDetails(activePrivateConversationId!),
        enabled: !!activePrivateConversationId,
    })

    const {
        data: messages,
        fetchNextPage: fetchNextMessagesPage,
        hasNextPage: hasNextMessagesPage,
        isFetchingNextPage: isFetchingNextMessagesPage,
    } = useInfiniteQuery<
        ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>,
        Error,
        InfiniteData<ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>>,
        ReturnType<typeof queryKeys.privateConversations.message>,
        string | undefined
    >({
        queryKey: queryKeys.privateConversations.message(activePrivateConversationId!),
        queryFn: ({ pageParam }) => fetchPrivateConversationMessagesById(activePrivateConversationId!, 15, pageParam),
        enabled: !!activePrivateConversationId,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.meta?.nextCursor ?? undefined,
    });

    const memoizedMessages = useMemo(() => {
        if (!messages) return [];

        return messages.pages
            .slice()
            .reverse()
            .flatMap((page) => (Array.isArray(page?.data) ? page.data : []))
            .filter(
                (
                    message
                ): message is PrivateConversationDetailsMessage =>
                    !!message &&
                    typeof message.id === 'string' &&
                    typeof message.createdAt === 'string'
            )
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
    }, [messages]);


    const messageForm = useForm({
        defaultValues: createMessageFormDefaultValues,
        validators: {
            onSubmit: createMessageFormSchema
        },
        onSubmit: async ({ value }) => {
            messageMutation.mutate(value);
        }
    });

    const messageMutation = useMutation({
        mutationFn: (data: CreateMessageFormValues) => createMessage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.privateConversations.lists(),
            });

            if (activePrivateConversationId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.privateConversations.detail(activePrivateConversationId),
                });
            }

            messageForm.setFieldValue('content', '');
        },
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        }
    });

    useEffect(() => {
        if (activePrivateConversationId) {
            messageForm.setFieldValue('private_conversation_id', activePrivateConversationId);
        }
    }, [messageForm, activePrivateConversationId]);

    const { handleScrollMessages, messagesContainerRef } = useChatRoomScroll({
        activePrivateConversationId,
        messagesLength: memoizedMessages.length,
        isRoomLoading,
        isRoomError,
        isFetchingNextMessagesPage,
        hasNextMessagesPage,
        fetchNextMessagesPage,
    });

    usePrivateMessageRead({
        activePrivateConversationId,
        messages: memoizedMessages,
    });

    return <ChatRoomView
        messageForm={messageForm}
        activePrivateConversationId={activePrivateConversationId}
        room={room?.data}
        messages={memoizedMessages}
        isRoomLoading={isRoomLoading}
        isRoomError={isRoomError}
        isCreateMessageLoading={messageMutation.isPending}
        isFetchingNextMessagesPage={isFetchingNextMessagesPage}
        handleScrollMessages={handleScrollMessages}
        messagesContainerRef={messagesContainerRef}
    />;
};

export default ChatRoom;
