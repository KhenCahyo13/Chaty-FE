import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';

import ChatBox from './components/chat-box';
import ChatBubble from './components/chat-bubble';
import ChatHeader from './components/chat-header';
import type { ChatRoomViewProps } from './types';

const ChatRoomView: FC<ChatRoomViewProps> = ({
    messageForm,
    activePrivateConversationId,
    room,
    messages,
    isRoomLoading,
    isRoomError,
    isCreateMessageLoading,
    isFetchingNextMessagesPage,
    handleScrollMessages,
    messagesContainerRef,
}) => {
    return (
        <div className="flex h-svh flex-col">
            {activePrivateConversationId ? (
                <>
                    {isRoomLoading ? (
                        <LoaderFallback label="Waiting for room data..." />
                    ) : isRoomError ? (
                        <ImageTextFallback
                            imageName="error"
                            label="Something went wrong while fetching room data."
                        />
                    ) : (
                        <>
                            <ChatHeader receiver={room?.receiver} />

                            {messages.length ? (
                                <div
                                    ref={messagesContainerRef}
                                    onScroll={handleScrollMessages}
                                    className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-y-4"
                                >
                                    {isFetchingNextMessagesPage && (
                                        <div className="text-center text-xs text-muted">
                                            Loading older messages…
                                        </div>
                                    )}

                                    {messages.map((message) => (
                                        <ChatBubble
                                            key={message.id}
                                            message={message}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <ImageTextFallback
                                    imageName="empty"
                                    label="Let's start new messages."
                                />
                            )}

                            <ChatBox
                                form={messageForm}
                                isCreateMessageLoading={
                                    isCreateMessageLoading
                                }
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
