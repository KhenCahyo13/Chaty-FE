import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';

import ChatBox from './components/chat-box';
import ChatBubble from './components/chat-bubble';
import ChatHeader from './components/chat-header';
import type { ChatRoomViewProps } from './types';

const ChatRoomView: FC<ChatRoomViewProps> = ({
    activePrivateConversationId,
    filesResetKey,
    handleScrollMessages,
    isCreateMessageLoading,
    isFetchingNextMessagesPage,
    isReceiverOnline,
    isRoomError,
    isRoomLoading,
    messageForm,
    messages,
    messagesContainerRef,
    messageVirtualItems,
    messageVirtualMeasureElement,
    messageVirtualTotalSize,
    receiverLastSeenAt,
    room,
}) => (
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
                        <ChatHeader
                            isReceiverOnline={isReceiverOnline}
                            receiver={room?.receiver}
                            receiverLastSeenAt={receiverLastSeenAt}
                        />

                        {messages.length ? (
                            <div
                                className="relative z-10 flex-1 overflow-y-auto px-2.5 py-3 md:px-4"
                                onScroll={handleScrollMessages}
                                ref={messagesContainerRef}
                            >
                                {isFetchingNextMessagesPage && (
                                    <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-border/60 bg-background/80 px-2.5 py-0.5 text-center text-[10px] text-muted-foreground backdrop-blur">
                                        Loading older messages…
                                    </div>
                                )}

                                <div
                                    className="relative w-full"
                                    style={{
                                        height: messageVirtualTotalSize,
                                    }}
                                >
                                    {messageVirtualItems.map((virtualRow) => {
                                        const message =
                                            messages[virtualRow.index];
                                        return (
                                            <div
                                                className={
                                                    message.isMe
                                                        ? 'absolute left-0 top-0 flex w-full justify-end pb-2.5'
                                                        : 'absolute left-0 top-0 flex w-full justify-start pb-2.5'
                                                }
                                                data-index={
                                                    virtualRow.index
                                                }
                                                key={virtualRow.key}
                                                ref={messageVirtualMeasureElement}
                                                style={{
                                                    transform: `translateY(${virtualRow.start}px)`,
                                                }}
                                            >
                                                <ChatBubble
                                                    message={message}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
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
                            key={filesResetKey}
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

export default memo(ChatRoomView);
