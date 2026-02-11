import { useForm } from '@tanstack/react-form';
import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type UIEvent, useCallback, useEffect, useMemo, useRef } from 'react';
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

import { createMessageFormDefaultValues, createMessageFormSchema } from './schema';
import type { CreateMessageFormValues } from './types';
import ChatRoomView from './view'

const ChatRoom = () => {
    const { activePrivateConversationId } = usePrivateConversationStore();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const prevScrollHeightRef = useRef(0);
    const hasAutoScrolledRef = useRef(false);
    const prevMessagesLengthRef = useRef(0);
    const shouldAutoScrollOnNewMessageRef = useRef(true);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
        const el = messagesContainerRef.current;

        if (!el) return false;

        el.scrollTo({
            top: el.scrollHeight,
            behavior,
        });

        shouldAutoScrollOnNewMessageRef.current = true;
        return true;
    }, []);

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

    const handleScrollMessages = useCallback(
        async (e: UIEvent<HTMLDivElement>) => {
            const el = e.target as HTMLDivElement;
            const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 64;

            shouldAutoScrollOnNewMessageRef.current = isNearBottom;

            // scroll ke atas → load pesan lama
            if (el.scrollTop === 0 && hasNextMessagesPage && !isFetchingNextMessagesPage) {
                prevScrollHeightRef.current = el.scrollHeight;

                await fetchNextMessagesPage();

                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
                    shouldAutoScrollOnNewMessageRef.current = false;
                });
            }
        },
        [
            fetchNextMessagesPage,
            hasNextMessagesPage,
            isFetchingNextMessagesPage,
        ]
    );


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

    useEffect(() => {
        hasAutoScrolledRef.current = false;
        prevMessagesLengthRef.current = 0;
        shouldAutoScrollOnNewMessageRef.current = true;
    }, [activePrivateConversationId]);

    useEffect(() => {
        if (!activePrivateConversationId || isRoomLoading || isRoomError) return;
        if (!memoizedMessages.length || isFetchingNextMessagesPage) return;

        const currentLength = memoizedMessages.length;
        const prevLength = prevMessagesLengthRef.current;

        if (!hasAutoScrolledRef.current) {
            requestAnimationFrame(() => {
                const hasScrolled = scrollToBottom('auto');

                if (!hasScrolled) return;

                hasAutoScrolledRef.current = true;
                prevMessagesLengthRef.current = currentLength;
            });
            return;
        }

        if (currentLength > prevLength && shouldAutoScrollOnNewMessageRef.current) {
            requestAnimationFrame(() => {
                scrollToBottom('smooth');
            });
        }

        prevMessagesLengthRef.current = currentLength;
    }, [
        activePrivateConversationId,
        memoizedMessages,
        isFetchingNextMessagesPage,
        isRoomLoading,
        isRoomError,
        scrollToBottom,
    ]);

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
