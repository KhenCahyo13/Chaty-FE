import { memo, type FC } from 'react';

import ChatBox from './components/chat-box';
import ChatBubble from './components/chat-bubble';
import ChatHeader from './components/chat-header';
import type { ChatRoomViewProps } from './types';
import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';

const ChatRoomView: FC<ChatRoomViewProps> = ({
    activePrivateConversationId,
    conversations,
    isConversationsLoading,
    isConversationsError,
}) => (
    <div className="flex h-svh flex-col">
        {activePrivateConversationId ? (
            <>
                {isConversationsLoading ? (
                    <LoaderFallback label='Waiting for conversations data...' />
                ) : isConversationsError ? (
                    <ImageTextFallback
                        imageName='error'
                        label="Something went wrong while fetching conversations."
                    />
                ) : (
                    <>
                        <ChatHeader
                            receiver={conversations?.receiver}
                        />
                        {conversations?.messages && conversations.messages.length > 0 ? (
                            <div className="flex-1 overflow-y-auto px-4 py-4 md:gap-y-6 flex flex-col gap-y-4">
                                {conversations.messages.map((message) => (
                                    <ChatBubble
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ImageTextFallback
                                imageName='empty'
                                label="Let's start new messages."
                            />
                        )}
                        <ChatBox />
                    </>
                )}
            </>
        ) : (
            <ImageTextFallback
                imageName='empty'
                label="No conversation selected, or let's start a new one."
            />
        )}
    </div>
);

export default memo(ChatRoomView);