import { IconChecks } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { formatLastSendTime } from '@/lib/datetime';
import { cn } from '@/lib/utils';

import type { ChatBubbleViewProps } from './types';

const ChatBubbleView: FC<ChatBubbleViewProps> = ({ body, message }) => {
    return (
        <div
            className={cn(
                'max-w-[84%] rounded-xl border px-3 py-2 md:max-w-[62%]',
                message.isMe
                    ? 'self-end rounded-br-sm border-primary/30 bg-[linear-gradient(145deg,oklch(0.56_0.2_259)_0%,oklch(0.64_0.16_244)_100%)] text-white dark:border-primary/40 dark:bg-[linear-gradient(145deg,oklch(0.34_0.08_260)_0%,oklch(0.29_0.06_252)_100%)]'
                    : 'self-start rounded-bl-sm border-border/70 bg-white/92 text-foreground backdrop-blur dark:bg-card/85'
            )}
        >
            <div className="flex items-center gap-x-1">
                {message.isMe && (
                    <IconChecks
                        className={cn(
                            'size-3.5 shrink-0 text-white/70',
                            message.isRead && 'text-cyan-200'
                        )}
                    />
                )}
                {body}
                <p
                    className={cn(
                        'shrink-0 text-[10px]',
                        message.isMe ? 'text-white/75' : 'text-muted-foreground'
                    )}
                >
                    {formatLastSendTime(message.createdAt)}
                </p>
            </div>
        </div>
    );
};

export default memo(ChatBubbleView);
