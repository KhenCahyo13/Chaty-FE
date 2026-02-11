import { type FC, memo } from 'react';

import { cn } from '@/lib/utils';

import type { ChatBubbleProps } from '../types';
import { IconChecks } from '@tabler/icons-react';
import { formatLastSendTime } from '@/lib/datetime';

const ChatBubble: FC<ChatBubbleProps> = ({
    message,
}) => (
    <div className={cn(
        'px-4 py-2 rounded-md md:max-w-1/2',
        message.isMe ? 'self-end bg-primary text-background rounded-tr-none' : 'self-start bg-accent rounded-tl-none'
    )}
    >
        <div className='flex items-center gap-x-2'>
            {message.isMe && <IconChecks className={cn(
                'size-4',
                message.isRead && 'text-blue-500'
            )} />}
            <p className={cn(
                'text-sm leading-relaxed',
                message.isDeleted && 'italic text-muted-foreground'
            )}>
                {message.content ? message.content : 'This message was deleted'}
            </p>
            <p className='text-xs text-muted-foreground'>
                {formatLastSendTime(message.createdAt)}
            </p>
        </div>
    </div>
);

export default memo(ChatBubble);