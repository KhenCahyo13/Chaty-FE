import { useForm } from '@tanstack/react-form';
import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { toast } from 'sonner';

import { fetchPrivateConversationDetails, fetchPrivateConversationMessagesById } from '@/api/private-conversations';
import { createMessage } from '@/api/private-messages';
import { IMAGE_FILE_EXTENSIONS } from '@/constants/file';
import { getFileExtensionFromUrl, getFileNameFromUrl } from '@/lib/file';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';

import { useChatRoomScroll } from './hooks/use-chat-room-scroll';
import { usePrivateMessageRead } from './hooks/use-private-message-read';
import { createMessageFormDefaultValues, createMessageFormSchema } from './schema';
import type { ChatRoomMessage, CreateMessageFormValues } from './types';
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

        const normalized = messages.pages
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
            );

        // Fast path: skip sorting when data is already in ascending time order.
        let prevTimestamp = -Infinity;
        let isSorted = true;

        for (const message of normalized) {
            const timestamp = Date.parse(message.createdAt);
            if (timestamp < prevTimestamp) {
                isSorted = false;
                break;
            }
            prevTimestamp = timestamp;
        }

        if (isSorted) return normalized;

        // Compute timestamps once, then sort using numeric comparison.
        const withTimestamp = normalized.map((message) => ({
            message,
            timestamp: Date.parse(message.createdAt),
        }));

        withTimestamp.sort((a, b) => a.timestamp - b.timestamp);
        return withTimestamp.map((item) => item.message);
    }, [messages]);

    const messagesWithFileMeta = useMemo<ChatRoomMessage[]>(() => {
        return memoizedMessages.map((message) => {
            if (!message.fileUrls?.length) return message;

            const fileMeta = message.fileUrls.map((fileUrl) => {
                const extension = getFileExtensionFromUrl(fileUrl);
                return {
                    fileName: getFileNameFromUrl(fileUrl),
                    isImage: IMAGE_FILE_EXTENSIONS.has(extension),
                    url: fileUrl,
                };
            });

            return {
                ...message,
                fileMeta,
            };
        });
    }, [memoizedMessages]);


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
        messagesLength: messagesWithFileMeta.length,
    });

    const messageVirtualizer = useVirtualizer({
        count: messagesWithFileMeta.length,
        estimateSize: () => 64,
        getScrollElement: () => messagesContainerRef.current,
        overscan: 8,
    });

    usePrivateMessageRead({
        activePrivateConversationId,
        messages: messagesWithFileMeta,
    });

    return <ChatRoomView
        activePrivateConversationId={activePrivateConversationId}
        filesResetKey={filesResetKey}
        handleScrollMessages={handleScrollMessages}
        isCreateMessageLoading={messageMutation.isPending}
        isFetchingNextMessagesPage={isFetchingNextMessagesPage}
        isRoomError={isRoomError}
        isRoomLoading={isRoomLoading}
        messageVirtualItems={messageVirtualizer.getVirtualItems()}
        messageVirtualMeasureElement={messageVirtualizer.measureElement}
        messageVirtualTotalSize={messageVirtualizer.getTotalSize()}
        messageForm={messageForm}
        messages={messagesWithFileMeta}
        messagesContainerRef={messagesContainerRef}
        room={room?.data}
    />;
};

export default ChatRoom;
