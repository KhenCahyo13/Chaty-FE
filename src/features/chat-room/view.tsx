import { type FC, memo, useEffect, useRef } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';

import ChatBox from './components/chat-box';
import ChatBubble from './components/chat-bubble';
import ChatHeader from './components/chat-header';
import type { ChatRoomViewProps } from './types';

const ChatRoomView: FC<ChatRoomViewProps> = ({
    messageForm,
    activePrivateConversationId,
    conversations,
    isConversationsLoading,
    isConversationsError,
    isCreateMessageLoading,
}) => {
    const endMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!conversations?.messages?.length) return;

        endMessagesRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [conversations?.messages?.length]);

    return (
        <div className="flex h-svh flex-col">
            {activePrivateConversationId ? (
                <>
                    {isConversationsLoading ? (
                        <LoaderFallback label="Waiting for conversations data..." />
                    ) : isConversationsError ? (
                        <ImageTextFallback
                            imageName="error"
                            label="Something went wrong while fetching conversations."
                        />
                    ) : (
                        <>
                            <ChatHeader receiver={conversations?.receiver} />

                            {conversations?.messages?.length ? (
                                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-y-4">
                                    {conversations.messages.map((message) => (
                                        <ChatBubble key={message.id} message={message} />
                                    ))}
                                    <div ref={endMessagesRef} />
                                </div>
                            ) : (
                                <ImageTextFallback
                                    imageName="empty"
                                    label="Let's start new messages."
                                />
                            )}

                            <ChatBox
                                form={messageForm}
                                isCreateMessageLoading={isCreateMessageLoading}
                            />
                        </>
                    )}
                </>
            ) : (
                <ImageTextFallback
                    imageName="empty"
                    label="No conversation selected, or let's start a new one."
                />
            )}
        </div>
    );
};

export default memo(ChatRoomView);