import { type FC, memo } from 'react';

import ChatBubbleView from './view';
import type { ChatBubbleProps } from '../../types';

const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
    return <ChatBubbleView message={message} />;
};

export default memo(ChatBubble);
