import { type FC, memo, useMemo } from 'react';

import ChatBubbleView from './view';
import type { ChatBubbleProps } from '../../types';
import { renderBody } from './helpers';

const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
    const body = useMemo(
        () => renderBody(message),
        [
            message.id,
            message.isDeleted,
            message.isMe,
            message.messageType,
            message.audioUrl,
            message.content,
            message.fileMeta,
            message.fileUrls,
        ]
    );

    return <ChatBubbleView body={body} message={message} />;
};

export default memo(ChatBubble);
