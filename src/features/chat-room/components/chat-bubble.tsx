import { IconChecks } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { formatLastSendTime } from '@/lib/datetime';
import { cn } from '@/lib/utils';

import type { ChatBubbleProps } from '../types';

const ChatBubble: FC<ChatBubbleProps> = ({
    message,
}) => (
    <div
        className={cn(
            'max-w-[84%] rounded-2xl border px-4 py-2.5 shadow-[0_14px_24px_-24px_oklch(0.28_0.08_256)] md:max-w-[66%]',
            message.isMe
                ? 'self-end rounded-br-md border-primary/30 bg-[linear-gradient(145deg,oklch(0.56_0.2_259)_0%,oklch(0.64_0.16_244)_100%)] text-white'
                : 'self-start rounded-bl-md border-border/70 bg-white/92 text-foreground backdrop-blur'
        )}
    >
        <div className='flex items-end gap-x-1.5'>
            {message.isMe && <IconChecks className={cn(
                'mb-0.5 size-4 shrink-0 text-white/70',
                message.isRead && 'text-cyan-200'
            )} />}
            <p className={cn(
                'wrap-break-word text-sm leading-relaxed',
                message.isDeleted && (message.isMe ? 'italic text-white/70' : 'italic text-muted-foreground')
            )}>
                {message.content ? message.content : 'This message was deleted'}
            </p>
            <p className={cn(
                'mb-0.5 shrink-0 text-[11px]',
                message.isMe ? 'text-white/75' : 'text-muted-foreground'
            )}>
                {formatLastSendTime(message.createdAt)}
            </p>
        </div>
    </div>
);

export default memo(ChatBubble);
