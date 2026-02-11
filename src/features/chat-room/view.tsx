import { memo } from 'react';
import ChatHeader from './components/chat-header';
import ChatBubble from './components/chat-bubble';
import ChatBox from './components/chat-box';
import { ImageTextFallback } from '@/components/fallback/image-text';

const ChatRoomView = () => (
    <div className="flex h-svh flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto px-4 py-4 md:gap-y-6 flex flex-col gap-y-4">
            {Array.from({ length: 20 }).map((_, index) => (
                <ChatBubble
                    key={index}
                    className={index % 2 === 0 ? 'self-start bg-accent rounded-tl-none' : 'self-end bg-primary text-background rounded-tr-none'}
                />
            ))}
        </div>
        <ChatBox />

        {/* <ImageTextFallback
            imageName='empty'
            label="No conversation selected, or let's start a new one."
        /> */}
    </div>
);

export default memo(ChatRoomView);