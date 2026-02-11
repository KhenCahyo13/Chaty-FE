import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { memo, type FC } from 'react';
import type { ChatItemProps } from './types';
import { formatLastSendTime } from '@/lib/datetime';

const ChatItemView: FC<ChatItemProps> = ({
    conversation
}) => (
    <div className="px-4 py-2 flex items-center gap-x-4 cursor-pointer hover:bg-accent">
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
                <span className="text-sm text-muted-foreground">
                    {formatLastSendTime(conversation.lastMessage.createdAt)}
                </span>
            </div>
            <p className='text-sm text-muted-foreground line-clamp-1'>{conversation.lastMessage.content}</p>
        </div>
    </div>
);

export default memo(ChatItemView);