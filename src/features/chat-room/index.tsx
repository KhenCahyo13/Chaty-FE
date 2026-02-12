import { useForm } from '@tanstack/react-form';
import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
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
    const [filesResetKey, setFilesResetKey] = useState(0);

    const { data: room, isError: isRoomError, isLoading: isRoomLoading } = useQuery({
        enabled: !!activePrivateConversationId,
        queryFn: () => fetchPrivateConversationDetails(activePrivateConversationId!),
        queryKey: queryKeys.privateConversations.detail(activePrivateConversationId!),
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
        enabled: !!activePrivateConversationId,
        getNextPageParam: (lastPage) => lastPage?.meta?.nextCursor ?? undefined,
        initialPageParam: undefined,
        queryFn: ({ pageParam }) => fetchPrivateConversationMessagesById(activePrivateConversationId!, 15, pageParam),
        queryKey: queryKeys.privateConversations.message(activePrivateConversationId!),
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
        onSubmit: async ({ value }) => {
            messageMutation.mutate(value);
        },
        validators: {
            onSubmit: createMessageFormSchema
        }
    });

    const messageMutation = useMutation({
        mutationFn: (data: CreateMessageFormValues) => createMessage(data),
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        },
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
            messageForm.setFieldValue('audio', undefined);
            messageForm.setFieldValue('files', []);
            setFilesResetKey((prev) => prev + 1);
        }
    });

    useEffect(() => {
        if (activePrivateConversationId) {
            messageForm.setFieldValue('private_conversation_id', activePrivateConversationId);
        }
    }, [messageForm, activePrivateConversationId]);

    const { handleScrollMessages, messagesContainerRef } = useChatRoomScroll({
        activePrivateConversationId,
        fetchNextMessagesPage,
        hasNextMessagesPage,
        isFetchingNextMessagesPage,
        isRoomError,
        isRoomLoading,
        messagesLength: memoizedMessages.length,
    });

    usePrivateMessageRead({
        activePrivateConversationId,
        messages: memoizedMessages,
    });

    return <ChatRoomView
        activePrivateConversationId={activePrivateConversationId}
        filesResetKey={filesResetKey}
        handleScrollMessages={handleScrollMessages}
        isCreateMessageLoading={messageMutation.isPending}
        isFetchingNextMessagesPage={isFetchingNextMessagesPage}
        isRoomError={isRoomError}
        isRoomLoading={isRoomLoading}
        messageForm={messageForm}
        messages={memoizedMessages}
        messagesContainerRef={messagesContainerRef}
        room={room?.data}
    />;
};

export default ChatRoom;
