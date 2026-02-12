import { type FC, memo, useMemo } from 'react';

import type { ChatBubbleProps } from '../../types';
import { renderBody } from './helpers';
import ChatBubbleView from './view';

const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
    const body = useMemo(() => renderBody(message), [message]);

    return <ChatBubbleView body={body} message={message} />;
};

export default memo(ChatBubble);
