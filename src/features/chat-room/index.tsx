import { useForm } from '@tanstack/react-form';
import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { fetchPrivateConversationDetails, fetchPrivateConversationMessagesById } from '@/api/private-conversations';
import { createMessage } from '@/api/private-messages';
import { formatSocketPrivateMessage } from '@/lib/message';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';
import type { SocketPrivateMessageCreatedPayload } from '@/types/realtime';

import { useChatRoomScroll } from './hooks/use-chat-room-scroll';
import { createMessageFormDefaultValues, createMessageFormSchema } from './schema';
import type { CreateMessageFormValues } from './types';
import ChatRoomView from './view'

const ChatRoom = () => {
    const { activePrivateConversationId } = usePrivateConversationStore();
    const { user } = useAuthStore();
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

        return messages.pages.slice().reverse()
            .flatMap((page) => page.data)
            .sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

    // Listen for new messages
    useEffect(() => {
        const onNewPrivateMessage = (payload: SocketPrivateMessageCreatedPayload) => {
            if (payload.private_conversation_id !== activePrivateConversationId) return;

            queryClient.setQueryData<InfiniteData<ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>>>(
                queryKeys.privateConversations.message(activePrivateConversationId), (old) => {
                    if (!old) return old;

                    const firstPage = old.pages[0];

                    return {
                        ...old,
                        pages: [
                            {
                                ...firstPage,
                                data: [
                                    ...firstPage.data,
                                    formatSocketPrivateMessage(payload.message, user?.id ?? ''),
                                ],
                            },
                            ...old.pages.slice(1),
                        ],
                    };
                }
            );
        };

        socket.on('private-message:new', onNewPrivateMessage);

        return () => {
            socket.off('private-message:new', onNewPrivateMessage);
        };
    }, [activePrivateConversationId, queryClient, user?.id]);

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
