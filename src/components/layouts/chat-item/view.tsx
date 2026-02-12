import { IconChecks } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatLastSendTime } from '@/lib/datetime';
import { cn } from '@/lib/utils';

import type { ChatItemViewProps } from './types';

const ChatItemView: FC<ChatItemViewProps> = ({
    activePrivateConversationId,
    conversation,
    setActivePrivateConversationId
}) => (
    <div
        className={cn(
            'group relative flex cursor-pointer items-center gap-x-2.5 rounded-xl border border-transparent px-2.5 py-2.5 transition-all',
            'hover:border-primary/15 hover:bg-white hover:shadow-[0_4px_10px_-12px_oklch(0.32_0.06_250)] dark:hover:bg-sidebar-accent/60 dark:hover:shadow-none',
            activePrivateConversationId === conversation.id &&
                'border-primary/20 bg-[linear-gradient(165deg,oklch(0.96_0.03_247)_0%,oklch(0.98_0.02_252)_100%)] shadow-[0_1px_2px_0_oklch(0.33_0.12_252/0.08)] dark:border-primary/40 dark:bg-none dark:bg-sidebar-accent/80 dark:shadow-none'
        )}
        onClick={() => setActivePrivateConversationId(conversation.id)}
    >
        <Avatar className="size-10 ring-1 ring-white/70">
            {conversation.sender.profile && conversation.sender.profile.avatarUrl ? (
                <AvatarImage alt={conversation.sender.profile.fullName} src={conversation.sender.profile.avatarUrl} />
            ) : (
                <AvatarFallback className="bg-primary/10 text-sm font-semibold">
                    {conversation.sender.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            )}
        </Avatar>
        <div className="flex w-full min-w-0 flex-col gap-y-0.5">
            <div className="flex items-center justify-between">
                <p className="truncate pr-2 text-sm font-semibold capitalize">
                    {conversation.sender.profile ? conversation.sender.profile.fullName : conversation.sender.username}
                </p>
                <span className="text-[12px] text-muted-foreground">
                    {formatLastSendTime(conversation.lastMessage.createdAt)}
                </span>
            </div>
            <div className='flex items-center justify-between'>
                <div className='flex min-w-0 items-center gap-x-2'>
                    {conversation.lastMessage.isMe && <IconChecks className={cn(
                        'size-3.5 shrink-0',
                        conversation.lastMessage.isRead ? 'text-blue-500' : 'text-muted-foreground'
                    )} />}
                    <p className={cn(
                        'line-clamp-1 text-[12px] text-muted-foreground',
                        conversation.lastMessage.isDeleted && 'italic'
                    )}>
                        {conversation.lastMessage.content ? conversation.lastMessage.content : 'This message was deleted'}
                    </p>
                </div>
                {conversation.unreadMessageCount > 0 && (
                    <Badge className="rounded-full px-1.5 py-0 text-[11px] leading-4">{conversation.unreadMessageCount}</Badge>
                )}
            </div>
        </div>
    </div>
);

export default memo(ChatItemView);
