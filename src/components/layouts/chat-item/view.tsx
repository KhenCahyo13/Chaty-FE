import { IconChecks } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatLastSendTime } from '@/lib/datetime';
import { cn } from '@/lib/utils';

import type { ChatItemViewProps } from './types';
import { Badge } from '@/components/ui/badge';

const ChatItemView: FC<ChatItemViewProps> = ({
    conversation,
    activePrivateConversationId,
    setActivePrivateConversationId
}) => (
    <div
        className={cn(
            'px-4 py-2 flex items-center gap-x-4 cursor-pointer hover:bg-accent',
            activePrivateConversationId === conversation.id && 'bg-primary/20 hover:bg-primary/20'
        )}
        onClick={() => setActivePrivateConversationId(conversation.id)}
    >
        <Avatar className="size-12">
            {conversation.sender.profile && conversation.sender.profile.avatarUrl ? (
                <AvatarImage src={conversation.sender.profile.avatarUrl} alt={conversation.sender.profile.fullName} />
            ) : (
                <AvatarFallback className="font-semibold md:text-lg">
                    {conversation.sender.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            )}
        </Avatar>
        <div className="w-full flex flex-col gap-y-1">
            <div className="flex items-center justify-between">
                <p className="font-medium capitalize">
                    {conversation.sender.profile ? conversation.sender.profile.fullName : conversation.sender.username}
                </p>
                <span className="text-xs text-muted-foreground">
                    {formatLastSendTime(conversation.lastMessage.createdAt)}
                </span>
            </div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-x-2'>
                    {conversation.lastMessage.isMe && <IconChecks className={cn(
                        'size-4',
                        conversation.lastMessage.isRead ? 'text-blue-500' : 'text-muted-foreground'
                    )} />}
                    <p className={cn(
                        'text-sm text-muted-foreground line-clamp-1',
                        conversation.lastMessage.isDeleted && 'italic'
                    )}>
                        {conversation.lastMessage.content ? conversation.lastMessage.content : 'This message was deleted'}
                    </p>
                </div>
                {conversation.unreadMessageCount > 0 && <Badge>{conversation.unreadMessageCount}</Badge>}
            </div>
        </div>
    </div>
);

export default memo(ChatItemView);