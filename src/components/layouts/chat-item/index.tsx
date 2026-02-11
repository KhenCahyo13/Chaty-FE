import { type FC,memo } from 'react';

import type { ChatItemProps } from './types';
import ChatItemView from './view';

const ChatItem: FC<ChatItemProps> = ({
    conversation
}) => {
    return <ChatItemView
        conversation={conversation}
    />;
};

export default memo(ChatItem);