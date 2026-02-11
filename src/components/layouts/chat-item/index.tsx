import { memo, type FC } from 'react';
import ChatItemView from './view';
import type { ChatItemProps } from './types';

const ChatItem: FC<ChatItemProps> = ({
    conversation
}) => {
    return <ChatItemView
        conversation={conversation}
    />;
};

export default memo(ChatItem);