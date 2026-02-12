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
        <div className="relative flex h-svh flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.95_0.04_230)_0%,transparent_36%),radial-gradient(circle_at_bottom_left,oklch(0.965_0.03_170)_0%,transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,oklch(0.33_0.03_240)_0%,transparent_36%),radial-gradient(circle_at_bottom_left,oklch(0.28_0.03_170)_0%,transparent_40%)]" />
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
                                    className="relative z-10 flex flex-1 flex-col gap-y-2.5 overflow-y-auto px-2.5 py-3 md:px-4"
                                >
                                    {isFetchingNextMessagesPage && (
                                        <div className="mx-auto rounded-full border border-border/60 bg-background/80 px-2.5 py-0.5 text-center text-[10px] text-muted-foreground backdrop-blur">
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
