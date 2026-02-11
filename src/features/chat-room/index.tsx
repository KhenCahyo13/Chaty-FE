import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { fetchPrivateConversationDetails } from '@/api/private-conversations';
import { createMessage } from '@/api/private-messages';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { socket } from '@/lib/socket';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { SocketPrivateMessageCreatedPayload } from '@/types/realtime';

import { createMessageFormDefaultValues, createMessageFormSchema } from './schema';
import type { CreateMessageFormValues } from './types';
import ChatRoomView from './view'

const ChatRoom = () => {
    const { activePrivateConversationId } = usePrivateConversationStore();
    const queryClient = useQueryClient();

    const { data: conversations, isLoading: isConversationsLoading, isError: isConversationsError } = useQuery({
        queryKey: queryKeys.privateConversations.detail(activePrivateConversationId!),
        queryFn: () => fetchPrivateConversationDetails(activePrivateConversationId!),
        enabled: !!activePrivateConversationId,
    });

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

    // Listen for new messages
    useEffect(() => {
        const onNewPrivateMessage = (payload: SocketPrivateMessageCreatedPayload) => {
            if (payload.private_conversation_id === activePrivateConversationId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.privateConversations.detail(
                        activePrivateConversationId
                    ),
                });
            }

            queryClient.invalidateQueries({
                queryKey: queryKeys.privateConversations.lists(),
            });
        };

        socket.on('private-message:new', onNewPrivateMessage);

        return () => {
            socket.off('private-message:new', onNewPrivateMessage);
        };
    }, [activePrivateConversationId, queryClient]);

    return <ChatRoomView
        messageForm={messageForm}
        activePrivateConversationId={activePrivateConversationId}
        conversations={conversations?.data}
        isConversationsLoading={isConversationsLoading}
        isConversationsError={isConversationsError}
        isCreateMessageLoading={messageMutation.isPending}
        
    />;
};

export default ChatRoom;